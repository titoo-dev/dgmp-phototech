"use client";
import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Building, Plus } from "lucide-react";
import PhotoGrid from "./photo-grid";
import { Market, Photo } from "./types";
import { Textarea } from "@/components/ui/textarea";
import { ProjectCombobox } from "@/components/combobox/project-combobox";
import type { ProjectWithCompany } from '@/actions/project/get-projects-action';

interface Props {
  market: Market;
  marketsCount: number;
  projects: ProjectWithCompany[];
  onRemoveMarket: (id: number) => void;
  onRemovePhoto: (marketId: number, photoId: number) => void;
  onUploadPhotos: (marketId: number, photos: Photo[]) => void;
  onChangeRemarks: (marketId: number, remarks: string) => void;
  onProjectChange: (marketId: number, projectId: string | null) => void;
}

export default function MarketCard({ market, marketsCount, projects, onRemoveMarket, onRemovePhoto, onUploadPhotos, onChangeRemarks, onProjectChange }: Props) {
  return (
		<Card className="border-border/50 shadow-none">
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="text-base font-medium">
						{market.name}
					</CardTitle>
					{marketsCount > 1 && (
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => onRemoveMarket(market.id)}
							className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
						>
							<X className="h-4 w-4" />
						</Button>
					)}
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Sélection de marché */}
				<div className="flex flex-col space-y-2">
					<div className="flex items-center justify-between">
						<label className="text-sm font-medium text-foreground">
							Marché à contrôler
							<span className="text-destructive ml-1">*</span>
						</label>
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="h-8 gap-1.5 text-xs"
							asChild
						>
							<Link href="/dashboard/projects/new">
								<Plus className="h-3 w-3" />
								Nouveau marché
							</Link>
						</Button>
					</div>
					<ProjectCombobox
						projects={projects}
						value={market.selectedProject?.id || ""}
						onValueChange={(projectId) => onProjectChange(market.id, projectId)}
						placeholder="Sélectionner un marché..."
					/>
					{market.selectedProject && (
						<div className="p-3 bg-muted/30 rounded-md">
							<p className="text-sm font-medium">{market.selectedProject.title}</p>
							<p className="text-xs text-muted-foreground">
								{market.selectedProject.company.name} • {market.selectedProject.status}
							</p>
						</div>
					)}
				</div>

				<PhotoGrid
					photos={market.photos}
					onRemove={(photoId) => onRemovePhoto(market.id, photoId)}
					onUpload={(photos) => onUploadPhotos(market.id, photos)}
				/>

				<div className="flex flex-col space-y-2">
					<label className="text-sm font-medium text-foreground">
						Remarques et observations
					</label>
					<Textarea
						placeholder="Entrer vos remarques et observations..."
						value={market.remarks}
						onChange={(e) =>
							onChangeRemarks(market.id, e.target.value)
						}
						className="min-h-[100px] resize-none"
					/>
				</div>
			</CardContent>
		</Card>
  );
}
