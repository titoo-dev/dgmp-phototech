'use client';

import { Button } from "@/components/ui/button"
import { Kanban, List } from "lucide-react"

interface KanbanViewToggleProps {
  viewMode: "kanban" | "list";
  onViewChange: (mode: "kanban" | "list") => void;
}

export function KanbanViewToggle({ viewMode, onViewChange }: KanbanViewToggleProps) {
  return (
    <div className="flex items-center border rounded-md">
      <Button
        variant={viewMode === "kanban" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("kanban")}
        className="rounded-r-none"
      >
        <Kanban className="w-4 h-4 mr-2" />
        Kanban
      </Button>
      <Button
        variant={viewMode === "list" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("list")}
        className="rounded-l-none"
      >
        <List className="w-4 h-4 mr-2" />
        Liste
      </Button>
    </div>
  )
}
