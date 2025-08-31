'use client';

import Image from 'next/image';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { MissionPhoto } from './generate-mission-photos';

type Props = {
  photo: MissionPhoto;
  onClose: () => void;
};

export default function PhotoModal({ photo, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-medium text-gray-900">{photo.title}</h2>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="border-gray-300 bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
              <Button size="sm" variant="ghost" onClick={onClose} className="hover:bg-gray-100">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Image src={photo.imageUrl} alt={photo.title} width={800} height={600} className="w-full rounded-lg border border-gray-200" />
            </div>

            <div className="space-y-6">
              <div>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${photo.status === 'Validé' ? 'bg-green-100 text-green-800' : photo.status === 'En cours' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                  {photo.status}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Projet</h4>
                  <p className="text-sm text-gray-700">{photo.project}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Entreprise</h4>
                  <p className="text-sm text-gray-700">{photo.company}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Localisation</h4>
                  <p className="text-sm text-gray-700">{photo.location}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Début mission</h4>
                    <p className="text-sm text-gray-700">{new Date(photo.startDate).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Fin mission</h4>
                    <p className="text-sm text-gray-700">{new Date(photo.endDate).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Photographe</h4>
                  <p className="text-sm text-gray-700">{photo.photographer}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Description</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{photo.description}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Observations</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{photo.observations}</p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Métadonnées</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Date de capture:</span> {photo.metadata.captureDate}</p>
                    <p><span className="font-medium">Coordonnées GPS:</span> {photo.metadata.gpsCoords}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
