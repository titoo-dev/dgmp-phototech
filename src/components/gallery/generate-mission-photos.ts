// Mock data generator for mission photos
export type MissionPhoto = {
  id: number;
  imageUrl: string;
  title: string;
  project: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  status: string;
  description: string;
  observations: string;
  photographer: string;
  metadata: { captureDate: string; gpsCoords: string };
};

export const generateMissionPhotos = (count: number): MissionPhoto[] => {
  const photos: MissionPhoto[] = [];
  const projects = [
    'Réhabilitation RN1 Libreville-Owendo',
    'Construction Pont Komo',
    'Construction Complexe Scolaire Akanda',
    'Extension Hôpital Franceville',
    'Assainissement Zone Industrielle',
    'Modernisation Quai Conteneurs',
  ];
  const companies = [
    'SOGEA-SATOM Gabon',
    'VINCI Construction',
    'ENTP Gabon',
    'Bouygues TP Gabon',
    'SAUR International',
    'Bolloré Ports',
  ];
  const locations = [
    'Libreville, Estuaire',
    'Ntoum, Estuaire',
    'Akanda, Estuaire',
    'Franceville, Haut-Ogooué',
    'Owendo, Estuaire',
  ];
  const statuses = ['Validé', 'En cours', 'En attente'];
  const photographers = [
    'Jean MBADINGA',
    'Marie ONDOUA',
    'Paul NGUEMA',
    'Sylvie MOUNGUENGUI',
    'André BOUSSOUGOU',
    'Christelle MBA',
  ];

  for (let i = 1; i <= count; i++) {
    const projectId = i % projects.length;
    const companyId = i % companies.length;
    const locationId = i % locations.length;
    const statusId = i % statuses.length;
    const photographerId = i % photographers.length;

    const randomSeedName = `photo-${i}-${projects[projectId]
      .toLowerCase()
      .replace(/\s+/g, '-')}`;

    photos.push({
      id: i,
      imageUrl: `https://picsum.photos/seed/${randomSeedName}/600/400`,
      title: `Mission Photo ${i} - ${projects[projectId].split(' ')[0]}`,
      project: projects[projectId],
      company: companies[companyId],
      location: locations[locationId],
      startDate: `2024-01-${(i % 28) + 1}`,
      endDate: `2024-01-${((i + 2) % 28) + 1}`,
      status: statuses[statusId],
      description: `Description détaillée de la mission photo ${i}.`,
      observations: `Observations spécifiques pour la photo ${i}.`,
      photographer: photographers[photographerId],
      metadata: {
        captureDate: `2024-01-${(i % 28) + 1} 10:00`,
        gpsCoords: `0.${3000 + i}° N, 9.${4000 + i}° E`,
      },
    });
  }
  return photos;
};
