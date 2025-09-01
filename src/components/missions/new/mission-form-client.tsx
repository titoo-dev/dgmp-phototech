"use client";

import * as React from 'react';
import { useState, useTransition, useEffect, useRef, useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { createMissionAction } from '@/actions/mission/create-mission-action';
import { toast } from 'sonner';
import { MissionModel } from '@/models/mission-schema';
import type { UserModel } from '@/models/user-schema';
import type { ContactModel } from '@/models/contact-schema';
import MissionHeader from '@/components/missions/new/mission-header';
import MissionInfoCard from '@/components/missions/new/mission-info-card';
import MarketCard from '@/components/missions/new/market-card';
import { Plus } from 'lucide-react';
import { Market, Photo } from '@/components/missions/new/types';

interface MissionFormClientProps {
	teamLeaders: UserModel[];
	contacts: ContactModel[];
}

export default function MissionFormClient({ teamLeaders, contacts }: MissionFormClientProps) {
	const [state, formAction] = useActionState(createMissionAction, {});
	const [isPending, startTransition] = useTransition();
	const formRef = useRef<HTMLFormElement | null>(null);

	const [formData, setFormData] = useState<Partial<MissionModel>>({
		teamLeader: undefined,
		members: [],
		startDate: undefined,
		endDate: undefined,
		location: "",
		agentCount: 0,
		marketCount: 1,
		status: "DRAFT",
	});

	const [markets, setMarkets] = useState<Market[]>([
		{ id: 1, name: "Marché 1", photos: [], remarks: "" },
	]);

	useEffect(() => {
		if (state.success) {
			toast.success('Mission créée avec succès', {
				description: 'La mission a été ajoutée à la base de données.',
				duration: 4000,
			});
			formRef.current?.reset();
			setMarkets([{ id: 1, name: 'Marché 1', photos: [], remarks: '' }]);
			setFormData({
				teamLeader: undefined,
				members: [],
				startDate: undefined,
				endDate: undefined,
				location: "",
				agentCount: 0,
				marketCount: 1,
				status: "DRAFT",
			});
		} else if (state.errors?._form) {
			toast.error('Erreur lors de la création', {
				description: state.errors._form[0],
				duration: 5000,
			});
		}
	}, [state.success, state.errors]);

	const handleAddMarket = () => {
		const newMarket: Market = {
			id: markets.length + 1,
			name: `Marché ${markets.length + 1}`,
			photos: [],
			remarks: "",
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

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!formRef.current) return;

		const form = new FormData(formRef.current);
		
		// Add computed fields
		form.set('marketCount', String(markets.length));
		form.set('status', 'DRAFT');
		
		// Add market data as JSON if needed
		const marketData = markets.map(market => ({
			name: market.name,
			remarks: market.remarks,
			photoCount: market.photos.length
		}));
		form.set('marketData', JSON.stringify(marketData));

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
		
		if (!teamLeaderId || !startDate || !endDate || !location) {
			toast.error('Champs requis manquants', {
				description: 'Veuillez remplir tous les champs obligatoires (dates, lieu).',
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
							/>
						</div>

						<div className="space-y-6">
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
										onRemoveMarket={handleRemoveMarket}
										onRemovePhoto={handleRemovePhoto}
										onUploadPhotos={handlePhotoUpload}
										onChangeRemarks={handleMarketRemarksChange}
									/>
								))}
							</div>
						</div>
					</div>
				</form>
			</div>
		</>
	);
}
