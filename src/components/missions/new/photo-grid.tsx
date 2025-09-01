"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, X, Loader2 } from "lucide-react";
import { Photo } from "./types";
import { toast } from "sonner";

interface Props {
  photos: Photo[];
  onRemove: (photoId: number) => void;
  onUpload: (photos: Photo[]) => void;
}

export default function PhotoGrid({ photos, onRemove, onUpload }: Props) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newPhotos: Photo[] = [];

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/image', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const result = await response.json();
        
        newPhotos.push({
          id: Date.now() + Math.random(),
          url: result.url,
          file: file,
          uploaded: true,
          uploadData: result
        });
      }

      onUpload(newPhotos);
      toast.success(`${newPhotos.length} photo(s) uploadée(s) avec succès`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Erreur lors de l\'upload des photos');
    } finally {
      setUploading(false);
      // Reset the input
      e.target.value = '';
    }
  };

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

				<label className={`flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 transition-colors hover:bg-muted/50 ${uploading ? 'opacity-50' : ''}`}>
					{uploading ? (
						<>
							<Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
							<span className="mt-1 text-xs text-muted-foreground">
								Upload...
							</span>
						</>
					) : (
						<>
							<ImageIcon className="h-6 w-6 text-muted-foreground" />
							<span className="mt-1 text-xs text-muted-foreground">
								Ajouter
							</span>
						</>
					)}
					<input
						type="file"
						multiple
						accept="image/*"
						className="hidden"
						onChange={handleFileUpload}
						disabled={uploading}
					/>
				</label>
			</div>
		</div>
  );
}
