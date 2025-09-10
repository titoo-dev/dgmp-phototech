'use client';

import { useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Download,
  ExternalLink,
  Calendar,
  MapPin,
  Building2,
  Users,
  Camera,
  FileText} from 'lucide-react';
import { downloadSinglePhoto } from '@/lib/download-utils';
import type { GalleryPhoto } from '@/actions/gallery/get-gallery-photos-action';

interface PhotoViewerDialogProps {
  photo: GalleryPhoto | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PhotoViewerDialog({ photo, isOpen, onClose }: PhotoViewerDialogProps) {
  const [isPending, startTransition] = useTransition();

  if (!photo) return null;

  const getStatusBadge = (status: string) => {
    const colors = {
      DRAFT: "bg-blue-100 text-blue-800 border-blue-200",
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      COMPLETED: "bg-green-100 text-green-800 border-green-200",
      REJECTED: "bg-red-100 text-red-800 border-red-200"
    } as const;

    const labels = {
      DRAFT: "Brouillon",
      PENDING: "En attente",
      COMPLETED: "Terminée",
      REJECTED: "Rejetée"
    } as const;

    return (
      <Badge className={`${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'} border text-xs`}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const getProjectStatusBadge = (status: string) => {
    const colors = {
      UNCONTROLLED: "bg-gray-100 text-gray-800",
      CONTROLLED_IN_PROGRESS: "bg-blue-100 text-blue-800",
      CONTROLLED_DELIVERED: "bg-green-100 text-green-800",
      CONTROLLED_OTHER: "bg-purple-100 text-purple-800",
      DISPUTED: "bg-red-100 text-red-800"
    } as const;

    const labels = {
      UNCONTROLLED: "Non contrôlé",
      CONTROLLED_IN_PROGRESS: "En cours",
      CONTROLLED_DELIVERED: "Livré",
      CONTROLLED_OTHER: "Autre",
      DISPUTED: "Litigieux"
    } as const;

    return (
      <Badge className={`${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'} text-xs`}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateLong = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleDownload = async () => {
    startTransition(async () => {
      try {
        await downloadSinglePhoto(photo);
      } catch (error) {
        console.error('Download error:', error);
        // Error handling is done in the utility function
      }
    });
  };

  const photoMetadata = photo.metadata ? JSON.parse(photo.metadata) : {};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[95vw] !w-[95vw] max-h-[95vh] overflow-y-auto lg:!max-w-7xl lg:!w-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Photo de mission</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Image Section */}
          <div className="space-y-4 xl:col-span-2">
            <div className="relative aspect-[4/3] lg:aspect-[16/10] xl:aspect-[16/9] rounded-lg overflow-hidden border">
              <Image
                src={photo.fileUrl}
                alt={`Photo de ${photo.missionProject.project.title}`}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Photo Metadata */}
            <Card className="shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Camera className="w-4 h-4" />
                  Informations photo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date de prise:</span>
                  <span>{formatDateLong(photo.createdAt)}</span>
                </div>
                {photoMetadata.originalName && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nom original:</span>
                    <span className="truncate ml-2">{photoMetadata.originalName}</span>
                  </div>
                )}
                {photoMetadata.size && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taille:</span>
                    <span>
                      {photoMetadata.size > 1024 * 1024 
                        ? `${(photoMetadata.size / (1024 * 1024)).toFixed(1)} MB`
                        : `${Math.round(photoMetadata.size / 1024)} KB`
                      }
                    </span>
                  </div>
                )}
                {photoMetadata.type && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="uppercase">{photoMetadata.type.split('/')[1] || 'Image'}</span>
                  </div>
                )}
              </CardContent>
            </Card>

             <Button
               size="sm"
               variant="outline"
               onClick={handleDownload}
               disabled={isPending}
               className="w-full"
             >
               <Download className="h-4 w-4 mr-2" />
               {isPending ? 'Téléchargement...' : 'Télécharger la photo'}
             </Button>
          </div>

          {/* Details Section */}
          <div className="space-y-4">
            {/* Mission Details */}
            <Card className="shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Mission #{photo.missionProject.mission.missionNumber}
                  </div>
                  <div className="flex gap-2">
                    {getStatusBadge(photo.missionProject.mission.status)}
                    <Link href={`/dashboard/missions?mission=${photo.missionProject.mission.id}`}>
                      <Button size="sm" variant="ghost" className="h-6 px-2">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Localisation:</span>
                  <span>{photo.missionProject.mission.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Chef d'équipe:</span>
                  <span>{photo.missionProject.mission.teamLeader.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Période:</span>
                  <span>
                    {formatDate(photo.missionProject.mission.startDate)} - {formatDate(photo.missionProject.mission.endDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Agents:</span>
                  <span>{photo.missionProject.mission.agentCount}</span>
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* Project Details */}
            <Card className="shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Projet associé
                  </div>
                  <div className="flex gap-2">
                    {getProjectStatusBadge(photo.missionProject.project.status)}
                    <Link href={`/dashboard/projects?project=${photo.missionProject.project.id}`}>
                      <Button size="sm" variant="ghost" className="h-6 px-2">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <span className="font-medium">Titre:</span>
                  <p className="mt-1">{photo.missionProject.project.title}</p>
                </div>
                <div>
                  <span className="font-medium">Description:</span>
                  <p className="mt-1 text-muted-foreground line-clamp-2">
                    {photo.missionProject.project.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Entreprise:</span>
                  <span>{photo.missionProject.project.company.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Nature:</span>
                  <span>{photo.missionProject.project.nature}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Période:</span>
                  <span>
                    {formatDate(photo.missionProject.project.startDate)} - {formatDate(photo.missionProject.project.endDate)}
                  </span>
                </div>
                {photo.missionProject.notes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded">
                    <span className="font-medium text-xs">Notes de mission:</span>
                    <p className="text-xs text-muted-foreground mt-1">{photo.missionProject.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
