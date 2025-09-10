'use client';

import { useState, useTransition } from 'react';
import { Filter, Download, Loader2, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PhotoCard from './photo-card';
import SearchFilters from './search-filters';
import GalleryPagination from './gallery-pagination';
import { PhotoViewerDialog } from './photo-viewer-dialog';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { downloadSinglePhoto, downloadPhotosAsZip, estimateZipSize } from '@/lib/download-utils';
import type { GalleryPhoto } from '@/actions/gallery/get-gallery-photos-action';

const PHOTOS_PER_PAGE = 18;

interface PhotoGalleryContentProps {
  photos: GalleryPhoto[];
}

export default function PhotoGalleryContent({ photos }: PhotoGalleryContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedProject, setSelectedProject] = useState(searchParams.get('project') || 'all');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'all');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [downloadProgress, setDownloadProgress] = useState<{current: number, total: number} | null>(null);

  const currentPage = parseInt(searchParams.get('page') || '1');

  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all' || value === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.set('page', '1'); // Reset to first page on filter/search change
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`?${params.toString()}`);
  };

  const filteredPhotos = photos.filter((photo) => {
    const matchesSearch =
      photo.missionProject.project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      photo.missionProject.project.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      photo.missionProject.mission.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      photo.missionProject.mission.teamLeader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      photo.missionProject.project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (photo.missionProject.notes && photo.missionProject.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesProject = selectedProject === 'all' || photo.missionProject.project.title === selectedProject;
    const matchesStatus = selectedStatus === 'all' || photo.missionProject.mission.status === selectedStatus;

    return matchesSearch && matchesProject && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPhotos.length / PHOTOS_PER_PAGE);
  const paginatedPhotos = filteredPhotos.slice((currentPage - 1) * PHOTOS_PER_PAGE, currentPage * PHOTOS_PER_PAGE);

  const uniqueProjects = [...new Set(photos.map((photo) => photo.missionProject.project.title))];
  const uniqueStatuses = [...new Set(photos.map((photo) => photo.missionProject.mission.status))];

  const handleSelectPhoto = (id: string) => {
    setSelectedPhotos((prevSelected) =>
      prevSelected.includes(id) ? prevSelected.filter((photoId) => photoId !== id) : [...prevSelected, id]
    );
  };

  const handleDownload = async () => {
    if (selectedPhotos.length === 0) {
      toast.error('Aucune photo sélectionnée');
      return;
    }

    const selectedPhotoObjects = photos.filter(photo => selectedPhotos.includes(photo.id));

    startTransition(async () => {
      try {
        if (selectedPhotos.length === 1) {
          // Single photo download
          await downloadSinglePhoto(selectedPhotoObjects[0]);
        } else {
          // Multiple photos - ZIP download
          setDownloadProgress({ current: 0, total: selectedPhotos.length });
          
          await downloadPhotosAsZip(selectedPhotoObjects, {
            onProgress: (current, total) => {
              setDownloadProgress({ current, total });
            }
          });
        }
        
        // Clear selection after successful download
        setSelectedPhotos([]);
        
      } catch (error) {
        console.error('Download error:', error);
        // Error handling is done in the utility functions
      } finally {
        setDownloadProgress(null);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-medium text-gray-900">Photothèque DGMP</h1>
              <p className="text-gray-600 text-sm mt-1">Direction Générale des Marchés Publics - République Gabonaise</p>
            </div>
            <div className="flex items-center space-x-3">
              {selectedPhotos.length > 0 && (
                <>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={handleDownload}
                      disabled={isPending || selectedPhotos.length === 0}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {downloadProgress ? `${downloadProgress.current}/${downloadProgress.total}` : 'Préparation...'}
                        </>
                      ) : selectedPhotos.length === 1 ? (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </>
                      ) : (
                        <>
                          <Archive className="h-4 w-4 mr-2" />
                          Télécharger ZIP {(() => {
                            const selectedPhotoObjects = photos.filter(photo => selectedPhotos.includes(photo.id));
                            const size = estimateZipSize(selectedPhotoObjects);
                            return size ? `(${size})` : '';
                          })()}
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <SearchFilters
        uniqueProjects={uniqueProjects}
        uniqueStatuses={uniqueStatuses}
        searchTerm={searchTerm}
        selectedProject={selectedProject}
        selectedStatus={selectedStatus}
        onSearchChange={(value) => {
          setSearchTerm(value);
          updateSearchParams('search', value);
        }}
        onProjectChange={(value) => {
          setSelectedProject(value);
          updateSearchParams('project', value);
        }}
        onStatusChange={(value) => {
          setSelectedStatus(value);
          updateSearchParams('status', value);
        }}
        // Bulk selection props
        filteredPhotosCount={filteredPhotos.length}
        selectedCount={selectedPhotos.length}
        onSelectAll={() => {
          const allFilteredIds = filteredPhotos.map(photo => photo.id);
          setSelectedPhotos(allFilteredIds);
        }}
        onDeselectAll={() => setSelectedPhotos([])}
        isPending={isPending}
      />

      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {paginatedPhotos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} isSelected={selectedPhotos.includes(photo.id)} onSelect={handleSelectPhoto} onOpen={(p) => setSelectedPhoto(p)} />
          ))}
        </div>

        {filteredPhotos.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400">
              <Filter className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg text-gray-600 mb-2">Aucun élément trouvé</p>
              <p className="text-sm text-gray-500">Essayez de modifier vos critères de recherche</p>
            </div>
          </div>
        )}

        <GalleryPagination totalPages={totalPages} currentPage={currentPage} onChange={handlePageChange} />
      </main>

      <PhotoViewerDialog photo={selectedPhoto} isOpen={!!selectedPhoto} onClose={() => setSelectedPhoto(null)} />
    </div>
  );
}
