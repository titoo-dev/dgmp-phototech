"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, X } from "lucide-react";
import { Photo } from "./types";

interface Props {
  photos: Photo[];
  onRemove: (photoId: number) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PhotoGrid({ photos, onRemove, onUpload }: Props) {
  return (
		<div className="flex flex-col space-y-3">
			<label className="text-sm font-medium text-foreground">
				Photos du marché
			</label>

			<div className="grid grid-cols-3 gap-3">
				{photos.map((photo) => (
					<div key={photo.id} className="group relative">
						<Image
							src={photo.url}
							alt="Photo"
							width={200}
							height={200}
							className="aspect-square w-full rounded-lg object-cover"
						/>
						<Button
							type="button"
							variant="destructive"
							size="icon"
							className="absolute -right-2 -top-2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
							onClick={() => onRemove(photo.id)}
						>
							<X className="h-3 w-3" />
						</Button>
					</div>
				))}

				<label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 transition-colors hover:bg-muted/50">
					<ImageIcon className="h-6 w-6 text-muted-foreground" />
					<span className="mt-1 text-xs text-muted-foreground">
						Ajouter
					</span>
					<input
						type="file"
						multiple
						accept="image/*"
						className="hidden"
						onChange={onUpload}
					/>
				</label>
			</div>
		</div>
  );
}
