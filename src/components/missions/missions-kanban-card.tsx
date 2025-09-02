'use client';

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Users,
  Calendar,
  Clock,
  CheckCircle,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  MapPin} from "lucide-react"
import Link from "next/link"
import { MissionModel } from "@/models/mission-schema"
import { MissionStatusDropdown } from "./mission-status-dropdown"
import { DeleteMissionDialog } from "./delete-mission-dialog"
import { MissionStatus } from "@/lib/generated/prisma"

interface MissionKanbanCardProps {
  mission: MissionModel;
  className?: string;
}

export function MissionKanbanCard({ mission, className }: MissionKanbanCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DRAFT":
        return <AlertCircle className="w-3 h-3 text-blue-600" />
      case "PENDING":
        return <Clock className="w-3 h-3 text-yellow-600" />
      case "COMPLETED":
        return <CheckCircle className="w-3 h-3 text-green-600" />
      case "REJECTED":
        return <AlertCircle className="w-3 h-3 text-red-600" />
      default:
        return <AlertCircle className="w-3 h-3 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "border-l-blue-500"
      case "PENDING":
        return "border-l-yellow-500"
      case "COMPLETED":
        return "border-l-green-500"
      case "REJECTED":
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

  return (
    <div className={`bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 ${getStatusColor(mission.status)} border-l-4 ${className}`}>
      <div className="p-4 space-y-3">
        {/* Header avec statut et actions */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(mission.status)}
            <span className="text-xs font-medium text-muted-foreground">
              #{mission.missionNumber}
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/missions/${mission.id}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  Voir détails
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/missions/${mission.id}/modifier`}>
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

        {/* Titre Mission */}
        <div className="space-y-1">
          <h4 className="font-medium text-sm line-clamp-2 leading-tight">
            Mission de contrôle #{mission.missionNumber}
          </h4>
          <p className="text-xs text-muted-foreground">
            {mission.location}
          </p>
        </div>

        {/* Dates */}
        <div className="space-y-1">
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{formatDate(mission.startDate)} - {formatDate(mission.endDate)}</span>
          </div>
        </div>

        {/* Chef d'équipe */}
        <div className="space-y-1">
          <div className="flex items-center text-xs">
            <Users className="w-3 h-3 mr-1 text-muted-foreground" />
            <span className="font-medium">{mission.teamLeader.name}</span>
          </div>
        </div>

        {/* Footer avec localisation et statistiques */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{mission.agentCount} agents</span>
            <span>{mission.marketCount} marchés</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Gabon</span>
          </div>
        </div>
      </div>
    </div>
  )
}
