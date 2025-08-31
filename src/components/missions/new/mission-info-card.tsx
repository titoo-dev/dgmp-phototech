"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Users, Building } from "lucide-react";
import { MissionModel } from "@/models/mission-schema";
import DatePickerField from "@/components/date-picker/date-picker-field";

interface Props {
  formData: Partial<MissionModel>;
  setFormData: (v: Partial<MissionModel> | ((prev: Partial<MissionModel>) => Partial<MissionModel>)) => void;
}

export default function MissionInfoCard({ formData, setFormData }: Props) {
  return (
		<Card className="border-border/50 shadow-none">
			<CardHeader className="pb-4">
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
					<div className="relative">
						<Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							name="teamLeaderId"
							type="number"
							placeholder="ID du chef de mission"
							className="pl-10"
							defaultValue={1}
						/>
					</div>
				</div>

				<div className="flex flex-col space-y-2">
					<label className="text-sm font-medium text-foreground">
						Membres de l&apos;équipe
					</label>
					<div className="relative">
						<Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							name="memberIds"
							placeholder="IDs des membres (séparés par des virgules)"
							className="pl-10"
						/>
					</div>
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
								placeholder="0"
								className="pl-10"
								value={formData.agentCount || ''}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										agentCount:
											parseInt(e.target.value) || 0,
									}))
								}
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
