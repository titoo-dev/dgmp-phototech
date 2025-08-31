'use client';

import { Building2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface NoProjectsFoundProps {
  searchQuery: string;
  onClearSearch: () => void;
}

export function NoProjectsFound({ searchQuery, onClearSearch }: NoProjectsFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <Search className="w-16 h-16 text-muted-foreground/50 mb-4" />
      <h3 className="text-xl font-semibold mb-2">
        Aucun projet trouvé
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        {searchQuery 
          ? `Aucun projet ne correspond à "${searchQuery}". Essayez de modifier vos critères de recherche.`
          : "Aucun projet n'est disponible pour le moment."
        }
      </p>
      <div className="flex items-center gap-3">
        {searchQuery && (
          <Button variant="outline" onClick={onClearSearch}>
            Effacer la recherche
          </Button>
        )}
        <Button asChild>
          <Link href="/projects/nouveau">
            <Building2 className="w-4 h-4 mr-2" />
            Créer un projet
          </Link>
        </Button>
      </div>
    </div>
  )
}
