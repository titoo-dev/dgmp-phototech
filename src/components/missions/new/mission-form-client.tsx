"use client";

import * as React from 'react';
import { useState, useTransition, useEffect, useRef, useActionState } from 'react';
import { createMissionAction } from '@/actions/mission/create-mission-action';
import { toast } from 'sonner';
import { MissionModel } from '@/models/mission-schema';
import type { UserModel } from '@/models/user-schema';
import type { ContactModel } from '@/models/contact-schema';
import MissionHeader from '@/components/missions/new/mission-header';
import MissionInfoCard from '@/components/missions/new/mission-info-card';
import MarketCard from '@/components/missions/new/market-card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Market, Photo } from '@/components/missions/new/types';
import type { ProjectWithCompany } from '@/actions/project/get-projects-action';
import { useRouter } from 'next/navigation';



interface MissionFormClientProps {
	teamLeaders: UserModel[];
	contacts: ContactModel[];
	projects: ProjectWithCompany[];
	currentUser: UserModel;
}

const STORAGE_KEY = 'mission-form-draft';

type MissionDraftData = {
	startDate: string;
	endDate: string;
	location: string;
	selectedContactIds: string[];
	markets: {
		id: number;
		name: string;
		remarks: string;
		selectedProjectId: string | null;
		photoCount: number;
	}[];
};

export default function MissionFormClient({ teamLeaders, contacts, projects, currentUser }: MissionFormClientProps) {
	const [state, formAction] = useActionState(createMissionAction, {});
	const [isPending, startTransition] = useTransition();
	const formRef = useRef<HTMLFormElement | null>(null);
	const router = useRouter();

	const [formData, setFormData] = useState<Partial<MissionModel>>({
		members: [],
		startDate: undefined,
		endDate: undefined,
		location: "",
		status: "DRAFT",
	});

	const [selectedContacts, setSelectedContacts] = useState<ContactModel[]>([]);

	const [markets, setMarkets] = useState<Market[]>([
		{ id: 1, name: "Marché 1", photos: [], remarks: "", selectedProject: null },
	]);

	// Load data from localStorage on mount
	useEffect(() => {
		const savedData = localStorage.getItem(STORAGE_KEY);
		if (savedData) {
			try {
				const parsedData = JSON.parse(savedData) as MissionDraftData;
				
				// Restore form data
				setFormData(prev => ({
					...prev,
					startDate: parsedData.startDate ? new Date(parsedData.startDate) : undefined,
					endDate: parsedData.endDate ? new Date(parsedData.endDate) : undefined,
					location: parsedData.location || '',
				}));

				// Restore selected contacts
				const restoredContacts = contacts.filter(contact => 
					parsedData.selectedContactIds.includes(contact.id)
				);
				setSelectedContacts(restoredContacts);

				// Restore markets
				const restoredMarkets = parsedData.markets.map(marketData => {
					const selectedProject = marketData.selectedProjectId 
						? projects.find(p => p.id === marketData.selectedProjectId) || null
						: null;
					
					return {
						id: marketData.id,
						name: marketData.name,
						remarks: marketData.remarks,
						selectedProject,
						photos: [] // Photos are not saved in localStorage
					};
				});
				setMarkets(restoredMarkets);

				// Show notification that data was restored
				if (parsedData.startDate || parsedData.endDate || parsedData.location || 
					parsedData.selectedContactIds.length > 0 || parsedData.markets.length > 1) {
					toast.info('Données du formulaire restaurées', {
						description: 'Vos données précédemment saisies ont été récupérées.',
						duration: 3000,
					});
				}
			} catch (error) {
				console.error('Error parsing saved mission form data:', error);
				localStorage.removeItem(STORAGE_KEY);
			}
		}
	}, [contacts, projects]);

	// Save data to localStorage whenever form data changes
	useEffect(() => {
		const draftData: MissionDraftData = {
			startDate: formData.startDate ? formData.startDate.toISOString().split('T')[0] : '',
			endDate: formData.endDate ? formData.endDate.toISOString().split('T')[0] : '',
			location: formData.location || '',
			selectedContactIds: selectedContacts.map(contact => contact.id),
			markets: markets.map(market => ({
				id: market.id,
				name: market.name,
				remarks: market.remarks,
				selectedProjectId: market.selectedProject?.id || null,
				photoCount: market.photos.length
			}))
		};

		// Only save if there's meaningful data
		const hasData = draftData.startDate || draftData.endDate || draftData.location || 
						draftData.selectedContactIds.length > 0 || draftData.markets.length > 1 ||
						draftData.markets.some(m => m.remarks || m.selectedProjectId);

		if (hasData) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(draftData));
		}
	}, [formData, selectedContacts, markets]);

	useEffect(() => {
		if (state.success) {
			toast.success('Mission créée avec succès', {
				description: 'La mission a été ajoutée à la base de données.',
				duration: 4000,
			});
			// Clear localStorage on success
			localStorage.removeItem(STORAGE_KEY);
			formRef.current?.reset();
			setSelectedContacts([]);
			setMarkets([{ id: 1, name: 'Marché 1', photos: [], remarks: '', selectedProject: null }]);
			setFormData({
				members: [],
				startDate: undefined,
				endDate: undefined,
				location: "",
				status: "DRAFT",
			});
			router.push('/dashboard/missions');
		} else if (state.errors?._form) {
			toast.error('Erreur lors de la création', {
				description: state.errors._form[0],
				duration: 5000,
			});
		}
	}, [state.success, state.errors, router]);

	const handleAddMarket = () => {
		const newMarket: Market = {
			id: markets.length + 1,
			name: `Marché ${markets.length + 1}`,
			photos: [],
			remarks: "",
			selectedProject: null,
		};
		setMarkets([...markets, newMarket]);
	};

	const handleRemoveMarket = (marketId: number) => {
		if (markets.length > 1) {
			setMarkets(markets.filter((market) => market.id !== marketId));
		}
	};

	const handlePhotoUpload = (marketId: number, newPhotos: Photo[]) => {
		setMarkets(
			markets.map((market) =>
				market.id === marketId ? { ...market, photos: [...market.photos, ...newPhotos] } : market
			)
		);
	};

	const handleRemovePhoto = (marketId: number, photoId: number) => {
		setMarkets(
			markets.map((market) =>
				market.id === marketId ? { ...market, photos: market.photos.filter((photo) => photo.id !== photoId) } : market
			)
		);
	};

	const handleMarketRemarksChange = (marketId: number, remarks: string) => {
		setMarkets(markets.map((market) => (market.id === marketId ? { ...market, remarks } : market)));
	};

	const handleMarketProjectChange = (marketId: number, projectId: string | null) => {
		const selectedProject = projectId ? projects.find(p => p.id === projectId) || null : null;
		setMarkets(markets.map((market) => 
			market.id === marketId ? { ...market, selectedProject } : market
		));
	};



	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!formRef.current) return;

		const form = new FormData(formRef.current);
		
		// Add computed fields
		form.set('status', 'DRAFT');
		
		// Add markets data as JSON (from markets)
		const projectsData = markets
			.filter(market => market.selectedProject)
			.map(market => ({
				projectId: market.selectedProject!.id,
				notes: market.remarks,
				marketName: market.name
			}));
		form.set('projectsData', JSON.stringify(projectsData));
		
		// Add market data as JSON
		const marketData = markets.map(market => ({
			name: market.name,
			remarks: market.remarks,
			photoCount: market.photos.length,
			projectId: market.selectedProject?.id || null
		}));
		form.set('marketData', JSON.stringify(marketData));

		// Add contact IDs (ensure uniqueness)
		const uniqueContactIds = [...new Set(selectedContacts.map(contact => contact.id))];
		uniqueContactIds.forEach(contactId => {
			form.append('memberIds', contactId);
		});

		// Ensure teamLeaderId is set correctly
		form.set('teamLeaderId', currentUser.id);

		// Add photo files for each market
		markets.forEach(market => {
			market.photos.forEach(photo => {
				if (photo.file) {
					form.append(`photos_${market.name}`, photo.file);
				}
			});
		});

		console.log('Form data being submitted:');
		for (const [key, value] of form.entries()) {
			console.log(key, value);
		}

		// Validate required fields
		const teamLeaderId = form.get('teamLeaderId');
		const startDate = form.get('startDate');
		const endDate = form.get('endDate');
		const location = form.get('location');
		
		console.log('Required fields check:');
		console.log('teamLeaderId:', teamLeaderId);
		console.log('startDate:', startDate);
		console.log('endDate:', endDate);
		console.log('location:', location);
		console.log('marketsWithProjects:', markets.filter(m => m.selectedProject).length);
		
		if (!teamLeaderId || !startDate || !endDate || !location) {
			toast.error('Champs requis manquants', {
				description: 'Veuillez remplir tous les champs obligatoires (chef de mission, dates, lieu).',
				duration: 5000,
			});
			return;
		}

		const marketsWithProjects = markets.filter(market => market.selectedProject);
		if (marketsWithProjects.length === 0) {
			toast.error('Aucun marché sélectionné', {
				description: 'Veuillez sélectionner au moins un marché pour un marché.',
				duration: 5000,
			});
			return;
		}

		startTransition(() => {
			formAction(form);
		});
	};

	return (
		<>
			<MissionHeader isPending={isPending} />
			<div className="mx-auto max-w-7xl px-6 py-8">
				<form id="mission-form" ref={formRef} onSubmit={handleSubmit}>
					<div className="grid gap-8 lg:grid-cols-2">
						<div className="space-y-6">
							<MissionInfoCard 
								formData={formData} 
								setFormData={setFormData}
								teamLeaders={teamLeaders}
								contacts={contacts}
								selectedContacts={selectedContacts}
								onContactsChange={setSelectedContacts}
								currentUser={currentUser}
							/>
						</div>

						<div className="space-y-6">
							{/* Marchés Section */}
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<h2 className="text-lg font-semibold text-foreground">Marchés contrôlés</h2>
									</div>
									<Button type="button" variant="outline" size="sm" onClick={handleAddMarket} className="gap-2">
										<Plus className="h-4 w-4" />
										Ajouter un marché
									</Button>
								</div>

								<div className="space-y-4">
									{markets.map((market) => (
										<MarketCard
											key={market.id}
											market={market}
											marketsCount={markets.length}
											projects={projects}
											onRemoveMarket={handleRemoveMarket}
											onRemovePhoto={handleRemovePhoto}
											onUploadPhotos={handlePhotoUpload}
											onChangeRemarks={handleMarketRemarksChange}
											onProjectChange={handleMarketProjectChange}
										/>
									))}
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
		</>
	);
}
