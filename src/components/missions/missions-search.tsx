import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Filter } from "lucide-react"

interface MissionSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

export function MissionSearch({ 
  searchQuery, 
  onSearchChange, 
  statusFilter, 
  onStatusFilterChange 
}: MissionSearchProps) {
  return (
    <div className="flex items-center gap-4 max-w-xl">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Rechercher par numéro de mission, chef d'équipe, lieu..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Statut
            {statusFilter !== "all" && (
              <span className="ml-1 text-xs bg-primary text-primary-foreground px-1 rounded">
                1
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuLabel>Filtrer par statut</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onStatusFilterChange("all")}>
            Tous les statuts
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusFilterChange("DRAFT")}>
            Brouillons
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusFilterChange("PENDING")}>
            En attente
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusFilterChange("COMPLETED")}>
            Validés
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusFilterChange("REJECTED")}>
            Refusés
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
