import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link";

export function MissionHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Rapports de mission</h1>
        <p className="text-muted-foreground">
          Gérez et suivez vos missions de mission de contrôle
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button asChild>
          <Link href="/dashboard/missions/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau rapport
          </Link>
        </Button>
      </div>
    </div>
  )
}
