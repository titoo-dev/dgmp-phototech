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
    Building2,
    Calendar,
    Clock,
    CheckCircle,
    AlertCircle,
    FileText,
    Users,
    Mail,
    Phone,
    MapPin,
    ExternalLink
} from "lucide-react";
import { getProjectAction } from "@/actions/project/get-project-action";

interface ProjectDetailsSheetProps {
    projectId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

type ProjectWithDetails = Awaited<ReturnType<typeof getProjectAction>>;

export function ProjectDetailsSheet({ projectId, isOpen, onClose }: ProjectDetailsSheetProps) {
    const [project, setProject] = useState<ProjectWithDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && projectId) {
            loadProjectDetails();
        }
    }, [isOpen, projectId]);

    const loadProjectDetails = async () => {
        if (!projectId) return;

        setLoading(true);
        setError(null);

        try {
            const projectData = await getProjectAction(projectId);
            setProject(projectData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load project details');
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toUpperCase()) {
            case "UNCONTROLLED":
                return <AlertCircle className="w-4 h-4 text-blue-600" />;
            case "CONTROLLED_IN_PROGRESS":
                return <Clock className="w-4 h-4 text-orange-600" />;
            case "CONTROLLED_DELIVERED":
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case "CONTROLLED_OTHER":
                return <AlertCircle className="w-4 h-4 text-yellow-600" />;
            case "DISPUTED":
                return <AlertCircle className="w-4 h-4 text-red-600" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-600" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const colors = {
            UNCONTROLLED: "bg-blue-100 text-blue-800 border-blue-200",
            CONTROLLED_IN_PROGRESS: "bg-orange-100 text-orange-800 border-orange-200",
            CONTROLLED_DELIVERED: "bg-green-100 text-green-800 border-green-200",
            CONTROLLED_OTHER: "bg-yellow-100 text-yellow-800 border-yellow-200",
            DISPUTED: "bg-red-100 text-red-800 border-red-200"
        } as const;

        const labels = {
            UNCONTROLLED: "Non contrôlé",
            CONTROLLED_IN_PROGRESS: "En cours",
            CONTROLLED_DELIVERED: "Livré",
            CONTROLLED_OTHER: "Autre",
            DISPUTED: "Litigieux"
        } as const;

        const upperStatus = status.toUpperCase();
        return (
            <Badge className={`${colors[upperStatus as keyof typeof colors]} border`}>
                {getStatusIcon(status)}
                <span className="ml-1">{labels[upperStatus as keyof typeof labels]}</span>
            </Badge>
        );
    };

    const getNatureBadge = (nature: string) => {
        const colors = {
            SUPPLY: "bg-purple-100 text-purple-800",
            SERVICES: "bg-indigo-100 text-indigo-800",
            INTELLECTUAL: "bg-pink-100 text-pink-800",
            PROGRAM: "bg-cyan-100 text-cyan-800",
            MIXED: "bg-gray-100 text-gray-800",
            CONTROLLED_EXPENSES: "bg-amber-100 text-amber-800"
        } as const;

        const labels = {
            SUPPLY: "Fourniture",
            SERVICES: "Services",
            INTELLECTUAL: "Intellectuel",
            PROGRAM: "Programme",
            MIXED: "Mixte",
            CONTROLLED_EXPENSES: "Dépenses contrôlées"
        } as const;

        const upperNature = nature.toUpperCase();
        return (
            <Badge className={`${colors[upperNature as keyof typeof colors]} text-xs`}>
                {labels[upperNature as keyof typeof labels]}
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

    const getDaysRemaining = () => {
        if (!project) return 0;
        const today = new Date();
        const endDate = new Date(project.endDate);
        const diffTime = endDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getMissionStatusBadge = (status: string) => {
        const colors = {
            DRAFT: "bg-blue-100 text-blue-800",
            PENDING: "bg-yellow-100 text-yellow-800",
            COMPLETED: "bg-green-100 text-green-800",
            REJECTED: "bg-red-100 text-red-800"
        } as const;

        const labels = {
            DRAFT: "Brouillon",
            PENDING: "En attente",
            COMPLETED: "Terminée",
            REJECTED: "Rejetée"
        } as const;

        const upperStatus = status.toUpperCase();
        return (
            <Badge className={`${colors[upperStatus as keyof typeof colors]} text-xs`}>
                {labels[upperStatus as keyof typeof labels]}
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

    if (error || !project) {
        return (
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="w-full sm:max-w-2xl lg:max-w-4xl">
                    <SheetTitle></SheetTitle>
                    <div className="flex flex-col items-center justify-center h-96 space-y-4">
                        <AlertCircle className="w-12 h-12 text-red-500" />
                        <p className="text-lg font-medium text-gray-900">Erreur de chargement</p>
                        <p className="text-sm text-gray-600">{error || 'Projet introuvable'}</p>
                        <Button onClick={loadProjectDetails} variant="outline">
                            Réessayer
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        );
    }

    const daysRemaining = getDaysRemaining();
    const isOverdue = daysRemaining < 0;
    const isDueSoon = daysRemaining <= 30 && daysRemaining >= 0;

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
                                        {project.title}
                                    </SheetTitle>
                                    <div className="flex items-center gap-2">
                                        {getStatusBadge(project.status)}
                                        {getNatureBadge(project.nature)}
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
                                    <div className="space-y-3">
                                        <p className="text-sm text-muted-foreground">
                                            {project.description}
                                        </p>
                                    </div>
                                    <Separator />
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                <span className="font-medium">Début:</span>
                                                <span>{formatDateLong(project.startDate)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                <span className="font-medium">Fin:</span>
                                                <span>{formatDateLong(project.endDate)}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            {isOverdue && (
                                                <div className="flex items-center gap-2 text-sm text-red-600">
                                                    <AlertCircle className="w-4 h-4" />
                                                    <span className="font-medium">En retard de {Math.abs(daysRemaining)} jours</span>
                                                </div>
                                            )}
                                            {isDueSoon && !isOverdue && (
                                                <div className="flex items-center gap-2 text-sm text-orange-600">
                                                    <Clock className="w-4 h-4" />
                                                    <span className="font-medium">Échéance dans {daysRemaining} jours</span>
                                                </div>
                                            )}
                                            {!isOverdue && !isDueSoon && (
                                                <div className="flex items-center gap-2 text-sm text-green-600">
                                                    <CheckCircle className="w-4 h-4" />
                                                    <span className="font-medium">Dans les délais</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Entreprise */}
                            <Card className='shadow-none'>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Building2 className="w-5 h-5" />
                                        Entreprise
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div>
                                            <h4 className="font-semibold text-lg">{project.company.name}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                NIF: {project.company.nif}
                                            </p>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                                    <span className="font-medium">Email:</span>
                                                    <span className="break-all">{project.company.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                                    <span className="font-medium">Téléphone:</span>
                                                    <span>{project.company.phoneNumber}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Users className="w-4 h-4 text-muted-foreground" />
                                                    <span className="font-medium">Employés:</span>
                                                    <span>{project.company.employeeCount} employé{project.company.employeeCount > 1 ? 's' : ''}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Missions associées */}
                            {project.missionProjects && project.missionProjects.length > 0 && (
                                <Card className='shadow-none'>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="w-5 h-5" />
                                            Missions associées ({project.missionProjects.length})
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {project.missionProjects.map((missionProject) => (
                                                <div key={missionProject.id} className="border rounded-lg p-4 space-y-3">
                                                    <div className="flex items-start justify-between">
                                                        <div className="space-y-2">
                                                            <h4 className="font-medium">
                                                                Mission #{missionProject.mission.missionNumber}
                                                            </h4>
                                                            <p className="text-sm text-muted-foreground">
                                                                {missionProject.mission.location}
                                                            </p>
                                                        </div>
                                                        {getMissionStatusBadge(missionProject.mission.status)}
                                                    </div>

                                                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                                                        <div className="space-y-2">
                                                            <div>
                                                                <span className="font-medium">Chef d'équipe:</span>
                                                                <span className="ml-2">{missionProject.mission.teamLeader.name}</span>
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Agents:</span>
                                                                <span className="ml-2">{missionProject.mission.agentCount} agent{missionProject.mission.agentCount > 1 ? 's' : ''}</span>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div>
                                                                <span className="font-medium">Début:</span>
                                                                <span className="ml-2">{formatDate(missionProject.mission.startDate)}</span>
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Fin:</span>
                                                                <span className="ml-2">{formatDate(missionProject.mission.endDate)}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {missionProject.notes && (
                                                        <div className="mt-3 p-3 bg-gray-50 rounded">
                                                            <p className="text-sm font-medium mb-1">Notes:</p>
                                                            <p className="text-sm text-muted-foreground">{missionProject.notes}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {project.missionProjects.length === 0 && (
                                <Card className='shadow-none'>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="w-5 h-5" />
                                            Missions associées (0)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-center py-8 text-muted-foreground">
                                            <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                            <p>Aucune mission associée à ce projet</p>
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
