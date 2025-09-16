"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Users } from "lucide-react";
import { MissionModel } from "@/models/mission-schema";
import type { ContactModel } from "@/models/contact-schema";
import DatePickerField from "@/components/date-picker/date-picker-field";
import ContactCreationDialog from "../new/contact-creation-dialog";
import ContactChips from "../new/contact-chips";

interface Props {
  formData: Partial<MissionModel>;
  setFormData: (v: Partial<MissionModel> | ((prev: Partial<MissionModel>) => Partial<MissionModel>)) => void;
  contacts: ContactModel[];
  selectedContacts: ContactModel[];
  onContactsChange: (contacts: ContactModel[]) => void;
}

export default function UpdateMissionInfoCard({ 
  formData, 
  setFormData, 
  contacts, 
  selectedContacts, 
  onContactsChange 
}: Props) {
  return (
		<Card className="border-border/50 shadow-none">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-lg">
					<Users className="h-5 w-5 text-primary" />
					Informations de la mission
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="flex flex-col space-y-2">
					<div className="flex items-center justify-between">
						<label className="text-sm font-medium text-foreground">
							Membres de l&apos;équipe
						</label>
						<ContactCreationDialog />
					</div>
					<ContactChips
						contacts={contacts}
						selectedContacts={selectedContacts}
						onContactsChange={onContactsChange}
					/>
				</div>

				<div className="grid gap-4 sm:grid-cols-2">
					<DatePickerField
						id="startDate"
						name="startDate"
						label="Date de début"
						placeholder="Sélectionner une date"
						value={formData.startDate ? formData.startDate.toISOString().split('T')[0] : ''}
						onChange={(dateString) =>
							setFormData((prev) => ({
								...prev,
								startDate: dateString ? new Date(dateString) : undefined,
							}))
						}
					/>

					<DatePickerField
						id="endDate"
						name="endDate"
						label="Date de fin"
						placeholder="Sélectionner une date"
						value={formData.endDate ? formData.endDate.toISOString().split('T')[0] : ''}
						onChange={(dateString) =>
							setFormData((prev) => ({ 
								...prev, 
								endDate: dateString ? new Date(dateString) : undefined 
							}))
						}
					/>
				</div>

				<div className="flex flex-col space-y-2">
					<label className="text-sm font-medium text-foreground">
						Lieu de la mission
					</label>
					<div className="relative">
						<MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							name="location"
							placeholder="Entrer le lieu de la mission"
							className="pl-10"
							value={formData.location}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									location: e.target.value,
								}))
							}
						/>
					</div>
				</div>
			</CardContent>
		</Card>
  );
}
