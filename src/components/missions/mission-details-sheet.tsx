'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Users,
    Calendar,
    MapPin,
    Clock,
    CheckCircle,
    AlertCircle,
    Building2,
    FileText,
    Camera
} from "lucide-react";
import { getMissionAction } from "@/actions/mission/get-mission-action";
import Image from "next/image";

interface MissionDetailsSheetProps {
    missionId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

type MissionWithDetails = Awaited<ReturnType<typeof getMissionAction>>;

export function MissionDetailsSheet({ missionId, isOpen, onClose }: MissionDetailsSheetProps) {
    const [mission, setMission] = useState<MissionWithDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && missionId) {
            loadMissionDetails();
        }
    }, [isOpen, missionId]);

    const loadMissionDetails = async () => {
        if (!missionId) return;

        setLoading(true);
        setError(null);

        try {
            const missionData = await getMissionAction(missionId);
            setMission(missionData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load mission details');
        } finally {
            setLoading(false);
        }
    };


    const getStatusIcon = (status: string) => {
        switch (status) {
            case "DRAFT":
                return <AlertCircle className="w-4 h-4 text-blue-600" />;
            case "PENDING":
                return <Clock className="w-4 h-4 text-yellow-600" />;
            case "COMPLETED":
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case "REJECTED":
                return <AlertCircle className="w-4 h-4 text-red-600" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-600" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            DRAFT: "default",
            PENDING: "secondary",
            COMPLETED: "default",
            REJECTED: "destructive"
        } as const;

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
            <Badge className={`${colors[status as keyof typeof colors]} border`}>
                {getStatusIcon(status)}
                <span className="ml-1">{labels[status as keyof typeof labels]}</span>
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
            <Badge className={`${colors[status as keyof typeof colors]} text-xs`}>
                {labels[status as keyof typeof labels]}
            </Badge>
        );
    };

    if (loading) {
        return (
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="w-full sm:max-w-2xl lg:max-w-4xl">
                    <SheetTitle></SheetTitle>
                    <div className="flex items-center justify-center h-96">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                </SheetContent>
            </Sheet>
        );
    }

    if (error || !mission) {
        return (
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="w-full sm:max-w-2xl lg:max-w-4xl">
                    <SheetTitle></SheetTitle>
                    <div className="flex flex-col items-center justify-center h-96 space-y-4">
                        <AlertCircle className="w-12 h-12 text-red-500" />
                        <p className="text-lg font-medium text-gray-900">Erreur de chargement</p>
                        <p className="text-sm text-gray-600">{error || 'Mission introuvable'}</p>
                        <Button onClick={loadMissionDetails} variant="outline">
                            Réessayer
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-2xl lg:max-w-4xl">
                <SheetTitle></SheetTitle>
                <ScrollArea className="h-full">
                    <div className="space-y-6 px-6 pb-6">
                        <SheetHeader className="space-y-4 p-0 pt-4">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <SheetTitle className="text-2xl font-bold p-0">
                                        Mission #{mission.missionNumber}
                                    </SheetTitle>
                                    <div className="flex items-center gap-2">
                                        {getStatusBadge(mission.status)}
                                    </div>
                                </div>
                            </div>
                        </SheetHeader>

                        <div className="grid gap-6">
                            {/* Informations générales */}
                            <Card className='shadow-none'>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        Informations générales
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm">
                                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                                <span className="font-medium">Localisation:</span>
                                                <span>{mission.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Users className="w-4 h-4 text-muted-foreground" />
                                                <span className="font-medium">Chef d'équipe:</span>
                                                <span>{mission.teamLeader.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Users className="w-4 h-4 text-muted-foreground" />
                                                <span className="font-medium">Agents:</span>
                                                <span>{mission.agentCount} agent{mission.agentCount > 1 ? 's' : ''}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                <span className="font-medium">Début:</span>
                                                <span>{formatDateLong(mission.startDate)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                <span className="font-medium">Fin:</span>
                                                <span>{formatDateLong(mission.endDate)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Building2 className="w-4 h-4 text-muted-foreground" />
                                                <span className="font-medium">Marchés:</span>
                                                <span>{mission.marketCount} marché{mission.marketCount > 1 ? 's' : ''}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Équipe */}
                            {mission.members && mission.members.length > 0 && (
                                <Card className='shadow-none'>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Users className="w-5 h-5" />
                                            Équipe ({mission.members.length + 1} membres)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <Users className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">{mission.teamLeader.name}</p>
                                                    <p className="text-xs text-muted-foreground">Chef d'équipe</p>
                                                </div>
                                            </div>
                                            <Separator />
                                            <div className="grid gap-2">
                                                {mission.members.map((member) => (
                                                    <div key={member.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                                                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                                                            <Users className="w-3 h-3 text-gray-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium">{member.firstName} {member.lastName}</p>
                                                            <p className="text-xs text-muted-foreground">{member.email}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Projets associés */}
                            {mission.missionProjects && mission.missionProjects.length > 0 && (
                                <Card className='shadow-none'>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Building2 className="w-5 h-5" />
                                            Projets associés ({mission.missionProjects.length})
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {mission.missionProjects.map((missionProject) => (
                                                <div key={missionProject.id} className="border rounded-lg p-4 space-y-3">
                                                    <div className="flex items-start justify-between">
                                                        <div className="space-y-2">
                                                            <h4 className="font-medium">{missionProject.project.title}</h4>
                                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                                {missionProject.project.description}
                                                            </p>
                                                        </div>
                                                        {getProjectStatusBadge(missionProject.project.status)}
                                                    </div>

                                                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                                                        <div className="space-y-2">
                                                            <div>
                                                                <span className="font-medium">Entreprise:</span>
                                                                <span className="ml-2">{missionProject.project.company.name}</span>
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Nature:</span>
                                                                <span className="ml-2">{missionProject.project.nature}</span>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div>
                                                                <span className="font-medium">Début:</span>
                                                                <span className="ml-2">{formatDate(missionProject.project.startDate)}</span>
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Fin:</span>
                                                                <span className="ml-2">{formatDate(missionProject.project.endDate)}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {missionProject.notes && (
                                                        <div className="mt-3 p-3 bg-gray-50 rounded">
                                                            <p className="text-sm font-medium mb-1">Notes:</p>
                                                            <p className="text-sm text-muted-foreground">{missionProject.notes}</p>
                                                        </div>
                                                    )}

                                                    {/* Photos du projet */}
                                                    {missionProject.files && missionProject.files.length > 0 && (
                                                        <div className="mt-4">
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <Camera className="w-4 h-4 text-muted-foreground" />
                                                                <span className="text-sm font-medium">Photos ({missionProject.files.length})</span>
                                                            </div>
                                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                                {missionProject.files.map((file) => (
                                                                    <div key={file.id} className="group relative aspect-square rounded-lg overflow-hidden border">
                                                                        <Image
                                                                            src={file.fileUrl}
                                                                            alt={`Photo de ${missionProject.project.title}`}
                                                                            fill
                                                                            className="object-cover"
                                                                        />
                                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                                                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                                            {file.metadata && (
                                                                                <p className="text-white text-xs truncate">{JSON.parse(file.metadata).originalName || 'Photo'}</p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                        </div>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
