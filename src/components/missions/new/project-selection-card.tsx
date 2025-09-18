"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Eye } from "lucide-react";
import { ProjectCombobox } from "@/components/combobox/project-combobox";
import type { ProjectWithCompany } from "@/actions/project/get-projects-action";

interface SelectedProject {
  id: string;
  project: ProjectWithCompany;
  notes: string;
}

interface ProjectSelectionCardProps {
  projects: ProjectWithCompany[];
  selectedProjects: SelectedProject[];
  onProjectsChange: (projects: SelectedProject[]) => void;
}

export default function ProjectSelectionCard({
  projects,
  selectedProjects,
  onProjectsChange,
}: ProjectSelectionCardProps) {
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);

  const handleAddProject = () => {
    setOpenProjectId(`new-${Date.now()}`);
  };

  const handleSelectProject = (projectId: string, tempId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const newProject: SelectedProject = {
      id: projectId,
      project,
      notes: "",
    };

    onProjectsChange([...selectedProjects, newProject]);
    setOpenProjectId(null);
  };

  const handleRemoveProject = (projectId: string) => {
    onProjectsChange(selectedProjects.filter(p => p.id !== projectId));
  };

  const handleNotesChange = (projectId: string, notes: string) => {
    onProjectsChange(
      selectedProjects.map(p =>
        p.id === projectId ? { ...p, notes } : p
      )
    );
  };



  const availableProjects = projects.filter(
    project => !selectedProjects.find(sp => sp.id === project.id)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Marchés contrôlés</h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddProject}
          className="gap-2"
          disabled={availableProjects.length === 0}
        >
          <Plus className="h-4 w-4" />
          Ajouter un marché
        </Button>
      </div>

      {/* Add new market selector */}
      {openProjectId?.startsWith('new-') && (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <ProjectCombobox
                projects={availableProjects}
                placeholder="Sélectionner un marché à contrôler..."
                onValueChange={(value) => handleSelectProject(value, openProjectId)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setOpenProjectId(null)}
              >
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected projects */}
      {selectedProjects.map((selectedProject) => (
        <Card key={selectedProject.id} className="border-border/50">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-base font-medium">
                  {selectedProject.project.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {selectedProject.project.company.name} • {selectedProject.project.status}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveProject(selectedProject.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Market Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes du contrôle du marché</label>
              <Textarea
                placeholder="Ajouter des notes sur le contrôle de ce marché..."
                value={selectedProject.notes}
                onChange={(e) => handleNotesChange(selectedProject.id, e.target.value)}
                rows={3}
              />
              <input
                type="hidden"
                name={`project-${selectedProject.id}-notes`}
                value={selectedProject.notes}
              />
            </div>



            {/* Hidden inputs for form submission */}
            <input
              type="hidden"
              name="selectedProjectIds"
              value={selectedProject.id}
            />
          </CardContent>
        </Card>
      ))}

      {selectedProjects.length === 0 && !openProjectId && (
        <Card className="border-dashed">
          <CardContent className="pt-6 pb-6 text-center">
            <p className="text-muted-foreground">
              Aucun marché sélectionné. Cliquez sur "Ajouter un marché" pour commencer.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
