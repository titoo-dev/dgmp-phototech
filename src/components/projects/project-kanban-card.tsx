'use client';

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Building2, 
  Calendar,
  Clock,
  CheckCircle,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  Phone,
  Mail,
  MapPin
} from "lucide-react"
import Link from "next/link"
import { ProjectModel } from "@/models/project-schema"

interface ProjectKanbanCardProps {
  projet: ProjectModel;
  className?: string;
}

export function ProjectKanbanCard({ projet, className }: ProjectKanbanCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "uncontrolled":
        return <AlertCircle className="w-3 h-3 text-blue-600" />
      case "controlled_in_progress":
        return <Clock className="w-3 h-3 text-orange-600" />
      case "controlled_delivered":
        return <CheckCircle className="w-3 h-3 text-green-600" />
      case "controlled_other":
        return <AlertCircle className="w-3 h-3 text-yellow-600" />
      case "disputed":
        return <AlertCircle className="w-3 h-3 text-red-600" />
      default:
        return <AlertCircle className="w-3 h-3 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "uncontrolled":
        return "border-l-blue-500"
      case "controlled_in_progress":
        return "border-l-orange-500"
      case "controlled_delivered":
        return "border-l-green-500"
      case "controlled_other":
        return "border-l-yellow-500"
      case "disputed":
        return "border-l-red-500"
      default:
        return "border-l-gray-500"
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getDaysRemaining = () => {
    const today = new Date()
    const endDate = new Date(projet.endDate)
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysRemaining = getDaysRemaining()
  const isOverdue = daysRemaining < 0
  const isDueSoon = daysRemaining <= 30 && daysRemaining >= 0

  return (
    <div className={`bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 ${getStatusColor(projet.status)} border-l-4 ${className}`}>
      <div className="p-4 space-y-3">
        {/* Header avec statut et actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(projet.status)}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/projects/${projet.id}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  Voir détails
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/projects/${projet.id}/modifier`}>
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Titre et description */}
        <div className="space-y-1">
          <h4 className="font-medium text-sm leading-tight break-words">
            {projet.title}
          </h4>
          <p className="text-xs text-muted-foreground break-words">
            {projet.description}
          </p>
        </div>

        {/* Dates */}
        <div className="space-y-1">
          <div className="flex items-start text-xs text-muted-foreground">
            <Calendar className="w-3 h-3 mr-1 mt-0.5 shrink-0" />
            <span className="break-words">{formatDate(projet.startDate)} - {formatDate(projet.endDate)}</span>
          </div>
          
          {/* Indicateur de délai */}
          {isOverdue && (
            <div className="flex items-start text-xs text-red-600">
              <AlertCircle className="w-3 h-3 mr-1 mt-0.5 shrink-0" />
              <span className="break-words">En retard de {Math.abs(daysRemaining)} jours</span>
            </div>
          )}
          {isDueSoon && !isOverdue && (
            <div className="flex items-start text-xs text-orange-600">
              <Clock className="w-3 h-3 mr-1 mt-0.5 shrink-0" />
              <span className="break-words">Échéance dans {daysRemaining} jours</span>
            </div>
          )}
        </div>

        {/* Entreprise */}
        <div className="space-y-1">
          <div className="flex items-start text-xs">
            <Building2 className="w-3 h-3 mr-1 mt-0.5 shrink-0 text-muted-foreground" />
            <span className="font-medium break-words">{projet.company.name}</span>
          </div>
          <div className="flex items-start text-xs text-muted-foreground">
            <Phone className="w-3 h-3 mr-1 mt-0.5 shrink-0" />
            <span className="break-words">{projet.company.phoneNumber}</span>
          </div>
          <div className="flex items-start text-xs text-muted-foreground">
            <Mail className="w-3 h-3 mr-1 mt-0.5 shrink-0" />
            <span className="break-all">{projet.company.email}</span>
          </div>
        </div>

        {/* Footer avec nature et statut */}
        <div className="flex items-center justify-between pt-2 border-t gap-2">
          <Badge variant="outline" className="text-xs break-words">
            {projet.nature}
          </Badge>
          <div className="flex items-center gap-1 shrink-0">
            <MapPin className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Gabon</span>
          </div>
        </div>
      </div>
    </div>
  )
}
