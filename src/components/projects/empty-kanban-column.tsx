export function EmptyKanbanColumn() {
  return (
    <div className="flex flex-1 min-h-[150px] flex-col items-center justify-center py-8 px-4 text-center">
      <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 w-full">
        <p className="text-sm text-muted-foreground font-medium">
          Aucun projet dans cette colonne
        </p>
        <p className="text-xs text-muted-foreground/75 mt-1">
          Glissez un projet ici
        </p>
      </div>
    </div>
  )
}
