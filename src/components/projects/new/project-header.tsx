"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Briefcase, Save } from "lucide-react"

export default function ProjectHeader({
  isPending = false,
}: {
  isPending?: boolean
}) {
  return (
    <div className="border-b bg-card/50 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Nouveau projet</h1>
              <p className="text-sm text-muted-foreground">Créer un nouveau projet de marché public</p>
            </div>
          </div>
          <Button type="submit" form="project-form" disabled={isPending} className="gap-2">
            <Save className="h-4 w-4" />
            {isPending ? 'Enregistrement...' : 'Enregistrer le projet'}
          </Button>
        </div>
      </div>
    </div>
  )
}
