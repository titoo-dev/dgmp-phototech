"use client";

import * as React from 'react';
import { useState, useTransition, useEffect, useRef, useActionState } from 'react';
import { updateMissionAction } from '@/actions/mission/update-mission-action';
import { toast } from 'sonner';
import { MissionModel } from '@/models/mission-schema';
import type { UserModel } from '@/models/user-schema';
import type { ContactModel } from '@/models/contact-schema';
import UpdateMissionHeader from '@/components/missions/update/update-mission-header';
import UpdateMissionInfoCard from '@/components/missions/update/update-mission-info-card';
import MarketCard from '@/components/missions/new/market-card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Market, Photo } from '@/components/missions/new/types';
import type { ProjectWithCompany } from '@/actions/project/get-projects-action';
import type { getMissionAction } from '@/actions/mission/get-mission-action';
import { useRouter } from 'next/navigation';

interface UpdateMissionFormClientProps {
	mission: Awaited<ReturnType<typeof getMissionAction>>;
	teamLeaders: UserModel[];
	contacts: ContactModel[];
	projects: ProjectWithCompany[];
}

export default function UpdateMissionFormClient({ 
	mission, 
	teamLeaders, 
	contacts, 
	projects 
}: UpdateMissionFormClientProps) {
	const [state, formAction] = useActionState(updateMissionAction, {});
	const [isPending, startTransition] = useTransition();
	const formRef = useRef<HTMLFormElement | null>(null);
	const router = useRouter();

	const [formData, setFormData] = useState<Partial<MissionModel>>({
		teamLeaderId: mission.teamLeaderId,
		members: mission.members,
		startDate: mission.startDate,
		endDate: mission.endDate,
		location: mission.location,
		agentCount: mission.agentCount,
		marketCount: mission.marketCount,
		status: mission.status,
	});

	const [selectedContacts, setSelectedContacts] = useState<ContactModel[]>(mission.members || []);

	// Auto-update agent count based on team leader + contacts
	useEffect(() => {
		const teamLeaderCount = formData.teamLeaderId ? 1 : 0;
		const agentCount = teamLeaderCount + selectedContacts.length;
		setFormData(prev => ({ ...prev, agentCount }));
	}, [formData.teamLeaderId, selectedContacts.length, setFormData]);

	// Initialize markets from mission data
	const [markets, setMarkets] = useState<Market[]>(() => {
		if (mission.missionProjects && mission.missionProjects.length > 0) {
			return mission.missionProjects.map((mp, index) => ({
				id: index + 1,
				name: `Marché ${index + 1}`,
				photos: mp.files?.map((file, fileIndex) => {
					let uploadData = {};
					try {
						uploadData = file.metadata ? JSON.parse(file.metadata) : {};
					} catch (error) {
						console.warn('Failed to parse file metadata:', error);
						uploadData = {};
					}
					return {
						id: fileIndex + 1,
						url: file.fileUrl,
						file: new File([''], 'existing-photo.jpg', { type: 'image/jpeg' }),
						uploaded: true,
						uploadData
					};
				}) || [],
				remarks: mp.notes || "",
				selectedProject: mp.project ? {
					id: mp.project.id,
					title: mp.project.title,
					description: mp.project.description,
					startDate: mp.project.startDate,
					endDate: mp.project.endDate,
					status: mp.project.status,
					companyId: mp.project.companyId,
					nature: mp.project.nature,
					company: mp.project.company,
					missionProjects: [] // Add empty array for compatibility
				} : null,
			}));
		}
		return [{ id: 1, name: "Marché 1", photos: [], remarks: "", selectedProject: null }];
	});

	useEffect(() => {
		if (state.success) {
			toast.success('Mission mise à jour avec succès', {
				description: 'Les modifications ont été enregistrées.',
				duration: 4000,
			});
			router.push('/dashboard/missions');
		} else if (state.errors?._form) {
			toast.error('Erreur lors de la mise à jour', {
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
		setFormData((prev) => ({ ...prev, marketCount: markets.length + 1 }));
	};

	const handleRemoveMarket = (marketId: number) => {
		if (markets.length > 1) {
			setMarkets(markets.filter((market) => market.id !== marketId));
			setFormData((prev) => ({ ...prev, marketCount: markets.length - 1 }));
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
		
		// Add mission ID
		form.set('id', mission.id);
		
		// Add computed fields
		form.set('marketCount', String(markets.length));
		
		// Add projects data as JSON (from markets)
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

		// Add contact IDs
		selectedContacts.forEach(contact => {
			form.append('memberIds', contact.id);
		});

		// Add photo files for each market (only new photos)
		markets.forEach(market => {
			market.photos.forEach(photo => {
				if (photo.file && !photo.uploaded) {
					form.append(`photos_${market.name}`, photo.file);
				}
			});
		});

		console.log('Form data being submitted for update:');
		for (const [key, value] of form.entries()) {
			console.log(key, value);
		}

		// Validate required fields
		const teamLeaderId = form.get('teamLeaderId');
		const startDate = form.get('startDate');
		const endDate = form.get('endDate');
		const location = form.get('location');
		
		if (!teamLeaderId || !startDate || !endDate || !location) {
			toast.error('Champs requis manquants', {
				description: 'Veuillez remplir tous les champs obligatoires (chef de mission, dates, lieu).',
				duration: 5000,
			});
			return;
		}

		const marketsWithProjects = markets.filter(market => market.selectedProject);
		if (marketsWithProjects.length === 0) {
			toast.error('Aucun projet sélectionné', {
				description: 'Veuillez sélectionner au moins un projet pour un marché.',
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
			<UpdateMissionHeader 
				mission={mission}
				isPending={isPending} 
			/>
			<div className="mx-auto max-w-7xl px-6 py-8">
				<form id="mission-form" ref={formRef} onSubmit={handleSubmit}>
					<div className="grid gap-8 lg:grid-cols-2">
						<div className="space-y-6">
							<UpdateMissionInfoCard 
								mission={mission}
								formData={formData} 
								setFormData={setFormData}
								teamLeaders={teamLeaders}
								contacts={contacts}
								selectedContacts={selectedContacts}
								onContactsChange={setSelectedContacts}
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
