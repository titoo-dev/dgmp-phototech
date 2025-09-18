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
    Mail,
    Phone,
    FileText,
    Users,
    AlertCircle,
    CheckCircle,
    ExternalLink,
    Calendar,
    MapPin
} from "lucide-react";
import { getCompanyAction } from "@/actions/company/get-company-action";

interface CompanyDetailsSheetProps {
    companyId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

type CompanyWithDetails = Awaited<ReturnType<typeof getCompanyAction>>;

export function CompanyDetailsSheet({ companyId, isOpen, onClose }: CompanyDetailsSheetProps) {
    const [company, setCompany] = useState<CompanyWithDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && companyId) {
            loadCompanyDetails();
        }
    }, [isOpen, companyId]);

    const loadCompanyDetails = async () => {
        if (!companyId) return;

        setLoading(true);
        setError(null);

        try {
            const companyData = await getCompanyAction(companyId);
            setCompany(companyData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load company details');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (employeeCount: number) => {
        if (employeeCount > 50) {
            return (
                <Badge className="bg-green-100 text-green-800 border-green-200 border">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Grande entreprise
                </Badge>
            );
        } else if (employeeCount > 10) {
            return (
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 border">
                    <Building2 className="w-3 h-3 mr-1" />
                    Entreprise moyenne
                </Badge>
            );
        } else if (employeeCount > 0) {
            return (
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 border">
                    <Users className="w-3 h-3 mr-1" />
                    Petite entreprise
                </Badge>
            );
        } else {
            return (
                <Badge className="bg-gray-100 text-gray-800 border-gray-200 border">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Inactive
                </Badge>
            );
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
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

    if (error || !company) {
        return (
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="w-full sm:max-w-2xl lg:max-w-4xl">
                    <SheetTitle></SheetTitle>
                    <div className="flex flex-col items-center justify-center h-96 space-y-4">
                        <AlertCircle className="w-12 h-12 text-red-500" />
                        <p className="text-lg font-medium text-gray-900">Erreur de chargement</p>
                        <p className="text-sm text-gray-600">{error || 'Entreprise introuvable'}</p>
                        <Button onClick={loadCompanyDetails} variant="outline">
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
                                        {company.name}
                                    </SheetTitle>
                                    <div className="flex items-center gap-2">
                                        {getStatusBadge(company.employeeCount)}
                                        <span className="text-sm text-muted-foreground">
                                            #{company.id.slice(-8)}
                                        </span>
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
                                                <Building2 className="w-4 h-4 text-muted-foreground" />
                                                <span className="font-medium">Dénomination:</span>
                                                <span>{company.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <FileText className="w-4 h-4 text-muted-foreground" />
                                                <span className="font-medium">NIF:</span>
                                                <span className="font-mono">{company.nif}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Users className="w-4 h-4 text-muted-foreground" />
                                                <span className="font-medium">Effectif:</span>
                                                <span>{company.employeeCount} employé{company.employeeCount > 1 ? 's' : ''}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail className="w-4 h-4 text-muted-foreground" />
                                                <span className="font-medium">Email:</span>
                                                <a 
                                                    href={`mailto:${company.email}`}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {company.email}
                                                </a>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone className="w-4 h-4 text-muted-foreground" />
                                                <span className="font-medium">Téléphone:</span>
                                                <a 
                                                    href={`tel:${company.phoneNumber}`}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {company.phoneNumber}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Marchés associés */}
                            {company.projects && company.projects.length > 0 ? (
                                <Card className='shadow-none'>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Building2 className="w-5 h-5" />
                                            Marchés ({company.projects.length})
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {company.projects.map((project) => (
                                                <div key={project.id} className="border rounded-lg p-4 space-y-3">
                                                    <div className="flex items-start justify-between">
                                                        <div className="space-y-2">
                                                            <h4 className="font-medium">{project.title}</h4>
                                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                                {project.description}
                                                            </p>
                                                        </div>
                                                        {getProjectStatusBadge(project.status)}
                                                    </div>

                                                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                                                        <div className="space-y-2">
                                                            <div>
                                                                <span className="font-medium">Nature:</span>
                                                                <span className="ml-2">{project.nature}</span>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div>
                                                                <span className="font-medium">Début:</span>
                                                                <span className="ml-2">{formatDate(project.startDate)}</span>
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Fin:</span>
                                                                <span className="ml-2">{formatDate(project.endDate)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card className='shadow-none'>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Building2 className="w-5 h-5" />
                                            Marchés (0)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-center py-8 text-muted-foreground">
                                            <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                            <p>Aucun marché associé à cette entreprise</p>
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
