import { Button } from "@/components/ui/button"
import { Plus, Kanban, List } from "lucide-react"
import Link from "next/link";

interface MissionHeaderProps {
  viewMode: 'kanban' | 'list';
  onViewModeChange: (mode: 'kanban' | 'list') => void;
}

export function MissionHeader({ viewMode, onViewModeChange }: MissionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Rapports de mission</h1>
        <p className="text-muted-foreground">
          Gérez et suivez vos missions de mission de contrôle
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center border rounded-lg p-1">
          <Button
            variant={viewMode === 'kanban' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('kanban')}
            className="h-8"
          >
            <Kanban className="h-4 w-4 mr-1" />
            Kanban
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('list')}
            className="h-8"
          >
            <List className="h-4 w-4 mr-1" />
            Liste
          </Button>
        </div>
        <Button asChild>
          <Link href="/missions/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau rapport
          </Link>
        </Button>
      </div>
    </div>
  )
}
