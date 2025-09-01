"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import PhotoGrid from "./photo-grid";
import { Market, Photo } from "./types";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  market: Market;
  marketsCount: number;
  onRemoveMarket: (id: number) => void;
  onRemovePhoto: (marketId: number, photoId: number) => void;
  onUploadPhotos: (marketId: number, photos: Photo[]) => void;
  onChangeRemarks: (marketId: number, remarks: string) => void;
}

export default function MarketCard({ market, marketsCount, onRemoveMarket, onRemovePhoto, onUploadPhotos, onChangeRemarks }: Props) {
  return (
		<Card className="border-border/50 shadow-none">
			<CardHeader className="pb-4">
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
