'use client';

import Image from 'next/image';
import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { GalleryPhoto } from '@/actions/gallery/get-gallery-photos-action';
import { useCallback } from 'react';

type Props = {
  photo: GalleryPhoto;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onOpen: (photo: GalleryPhoto) => void;
};

export default function PhotoCard({ photo, isSelected, onSelect, onOpen }: Props) {
    const handleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect(photo.id);
    }, [onSelect, photo.id]);

    const handleDoubleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onOpen(photo);
    }, [onOpen, photo]);

    return (
        <div
            className={`group relative cursor-pointer rounded-lg p-2 transition-colors duration-150 ${isSelected ? 'bg-blue-100 ring-1 ring-blue-100' : 'hover:bg-gray-100'}`}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
        >
            <div className="relative">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2 border border-gray-200">
                    <Image src={photo.fileUrl} alt={`Photo de ${photo.missionProject.project.title}`} width={600} height={400} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2">
                        <div className={`w-3 h-3 rounded-full ${
                            photo.missionProject.mission.status === 'COMPLETED' ? 'bg-green-500' : 
                            photo.missionProject.mission.status === 'PENDING' ? 'bg-yellow-500' : 
                            photo.missionProject.mission.status === 'DRAFT' ? 'bg-blue-500' :
                            'bg-red-500'
                        }`} />
                    </div>
                </div>

                <div className="px-1">
                    <h3 className="text-sm text-gray-900 font-normal truncate mb-1">{photo.missionProject.project.title}</h3>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 truncate">{new Date(photo.createdAt).toLocaleDateString('fr-FR')}</span>
                        <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 hover:bg-gray-200" onClick={(e) => e.stopPropagation()}>
                            <MoreVertical className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
