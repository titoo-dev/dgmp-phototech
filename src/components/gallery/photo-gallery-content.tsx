'use client';

import { useState } from 'react';
import { Filter } from 'lucide-react';
import PhotoCard from './photo-card';
import PhotoModal from './photo-modal';
import SearchFilters from './search-filters';
import GalleryPagination from './gallery-pagination';
import { generateMissionPhotos, type MissionPhoto } from './generate-mission-photos';
import { useSearchParams, useRouter } from 'next/navigation';

const missionPhotos = generateMissionPhotos(50);
const PHOTOS_PER_PAGE = 18;

export default function PhotoGalleryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedProject, setSelectedProject] = useState(searchParams.get('project') || 'all');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'all');
  const [selectedPhoto, setSelectedPhoto] = useState<MissionPhoto | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);

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

  const filteredPhotos = missionPhotos.filter((photo) => {
    const matchesSearch =
      photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      photo.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      photo.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      photo.photographer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      photo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      photo.observations.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesProject = selectedProject === 'all' || photo.project === selectedProject;
    const matchesStatus = selectedStatus === 'all' || photo.status === selectedStatus;

    return matchesSearch && matchesProject && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPhotos.length / PHOTOS_PER_PAGE);
  const paginatedPhotos = filteredPhotos.slice((currentPage - 1) * PHOTOS_PER_PAGE, currentPage * PHOTOS_PER_PAGE);

  const uniqueProjects = [...new Set(missionPhotos.map((photo) => photo.project))];
  const uniqueStatuses = [...new Set(missionPhotos.map((photo) => photo.status))];

  const handleSelectPhoto = (id: number) => {
    setSelectedPhotos((prevSelected) =>
      prevSelected.includes(id) ? prevSelected.filter((photoId) => photoId !== id) : [...prevSelected, id]
    );
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
                  <span className="text-sm font-medium text-blue-600">{selectedPhotos.length} sélectionné(s)</span>
                  <button className="btn btn-outline btn-sm" onClick={() => setSelectedPhotos([])}>Désélectionner tout</button>
                </>
              )}
              <span className="text-sm text-gray-600">{filteredPhotos.length} éléments</span>
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

      {selectedPhoto && <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />}
    </div>
  );
}
