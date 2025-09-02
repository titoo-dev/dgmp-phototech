"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Users, Building } from "lucide-react";
import { MissionModel } from "@/models/mission-schema";
import type { UserModel } from "@/models/user-schema";
import type { ContactModel } from "@/models/contact-schema";
import DatePickerField from "@/components/date-picker/date-picker-field";
import { UserCombobox } from "@/components/combobox/user-combobox";
import ContactCreationDialog from "./contact-creation-dialog";
import ContactChips from "./contact-chips";

interface Props {
  formData: Partial<MissionModel>;
  setFormData: (v: Partial<MissionModel> | ((prev: Partial<MissionModel>) => Partial<MissionModel>)) => void;
  teamLeaders: UserModel[];
  contacts: ContactModel[];
  selectedContacts: ContactModel[];
  onContactsChange: (contacts: ContactModel[]) => void;
}

export default function MissionInfoCard({ formData, setFormData, teamLeaders, contacts, selectedContacts, onContactsChange }: Props) {
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
					<label className="text-sm font-medium text-foreground">
						Chef de mission
					</label>
					<UserCombobox
						users={teamLeaders}
						name="teamLeaderId"
						placeholder="Sélectionner un chef de mission"
						onValueChange={(value) => 
							setFormData((prev) => ({ ...prev, teamLeaderId: value }))
						}
					/>
				</div>

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
						defaultValue={formData.startDate}
						onChange={(date) =>
							setFormData((prev) => ({
								...prev,
								startDate: date,
							}))
						}
					/>

					<DatePickerField
						id="endDate"
						name="endDate"
						label="Date de fin"
						placeholder="Sélectionner une date"
						defaultValue={formData.endDate}
						onChange={(date) =>
							setFormData((prev) => ({ ...prev, endDate: date }))
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

				<div className="grid gap-4 sm:grid-cols-2">
					<div className="flex flex-col space-y-2">
						<label className="text-sm font-medium text-foreground">
							Nombre d&apos;agents
						</label>
						<div className="relative">
							<Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								name="agentCount"
								type="number"
								min="1"
								value={(formData.teamLeaderId ? 1 : 0) + selectedContacts.length}
								className="pl-10 bg-muted/50"
								readOnly
							/>
						</div>
					</div>

					<div className="flex flex-col space-y-2">
						<label className="text-sm font-medium text-foreground">
							Nombre de marchés
						</label>
						<div className="relative">
							<Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								name="marketCount"
								type="number"
								min="1"
								value={formData.marketCount}
								className="pl-10 bg-muted/50"
								readOnly
							/>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
  );
}
