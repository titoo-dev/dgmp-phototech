'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, CheckSquare, Square } from 'lucide-react';

type Props = {
  uniqueProjects: string[];
  uniqueStatuses: string[];
  searchTerm: string;
  selectedProject: string;
  selectedStatus: string;
  onSearchChange: (value: string) => void;
  onProjectChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  // Bulk selection props
  filteredPhotosCount: number;
  selectedCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  isPending: boolean;
};

export default function SearchFilters({ 
  uniqueProjects, 
  uniqueStatuses, 
  searchTerm, 
  selectedProject, 
  selectedStatus, 
  onSearchChange, 
  onProjectChange, 
  onStatusChange,
  filteredPhotosCount,
  selectedCount,
  onSelectAll,
  onDeselectAll,
  isPending
}: Props) {
  const [local, setLocal] = useState(searchTerm);

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher dans la photothèque"
                value={local}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setLocal(e.target.value);
                  onSearchChange(e.target.value);
                }}
                className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={selectedProject} onValueChange={(value) => onProjectChange(value)}>
              <SelectTrigger className="w-48 border-gray-300">
                <SelectValue placeholder="Tous les marchés" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les marchés</SelectItem>
                {uniqueProjects.map((project) => (
                  <SelectItem key={project} value={project}>{project}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={(value) => onStatusChange(value)}>
              <SelectTrigger className="w-40 border-gray-300">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {uniqueStatuses.map((status) => {
                  const statusLabels = {
                    DRAFT: "Brouillon",
                    PENDING: "En attente", 
                    COMPLETED: "Terminée",
                    REJECTED: "Rejetée"
                  } as const;
                  return (
                    <SelectItem key={status} value={status}>
                      {statusLabels[status as keyof typeof statusLabels] || status}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            {/* Bulk selection controls */}
            {filteredPhotosCount > 0 && (
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-300">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={selectedCount === filteredPhotosCount ? onDeselectAll : onSelectAll}
                  disabled={isPending}
                  className="text-xs"
                >
                  {selectedCount === filteredPhotosCount ? (
                    <>
                      <CheckSquare className="h-3 w-3 mr-1" />
                      Tout désélectionner
                    </>
                  ) : (
                    <>
                      <Square className="h-3 w-3 mr-1" />
                      Sélectionner tout
                    </>
                  )}
                </Button>
                {selectedCount > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {selectedCount} / {filteredPhotosCount} sélectionnés
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
