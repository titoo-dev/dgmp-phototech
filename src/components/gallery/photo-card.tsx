'use client';

import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';
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
            className={`group relative cursor-pointer rounded-lg p-2 transition-all duration-200 ${
                isSelected 
                    ? 'bg-blue-50 ring-2 ring-blue-500 shadow-md transform scale-[0.98]' 
                    : 'hover:bg-gray-100 hover:shadow-sm'
            }`}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
        >
            <div className="relative">
                <div className={`aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2 border transition-all duration-200 ${
                    isSelected ? 'border-blue-300 shadow-sm' : 'border-gray-200'
                }`}>
                    <Image 
                        src={photo.fileUrl} 
                        alt={`Photo de ${photo.missionProject.project.title}`} 
                        width={600} 
                        height={400} 
                        className={`w-full h-full object-cover transition-all duration-200 ${
                            isSelected ? 'brightness-110' : ''
                        }`} 
                    />
                    
                    {/* Selection indicator */}
                    {isSelected && (
                        <div className="absolute top-2 left-2 bg-blue-500 rounded-full p-1 shadow-md">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                    )}
                    
                    {/* Mission status indicator */}
                    <div className="absolute top-2 right-2">
                        <div className={`w-3 h-3 rounded-full shadow-sm ${
                            photo.missionProject.mission.status === 'COMPLETED' ? 'bg-green-500' : 
                            photo.missionProject.mission.status === 'PENDING' ? 'bg-yellow-500' : 
                            photo.missionProject.mission.status === 'DRAFT' ? 'bg-blue-500' :
                            'bg-red-500'
                        }`} />
                    </div>
                </div>

                <div className="px-1">
                    <h3 className={`text-sm font-normal truncate mb-1 transition-colors duration-200 ${
                        isSelected ? 'text-blue-900 font-medium' : 'text-gray-900'
                    }`}>
                        {photo.missionProject.project.title}
                    </h3>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 truncate">
                            {new Date(photo.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
