'use client';

import { useState, useMemo, useEffect } from 'react';
import { ProjectHeader } from '@/components/projects/project-header';
import { ProjectSearch } from '@/components/projects/project-search';
import { ProjectKanbanView } from '@/components/projects/project-kanban-view';
import { ProjectListTable } from '@/components/projects/project-list-table';
import type { ProjectWithCompany } from '../../actions/project/get-projects-action';
import type { ProjectModel } from '@/models/project-schema';

interface ProjectsClientProps {
  projects: ProjectWithCompany[];
}

type ProjectKanbanItem = {
  id: string;
  name: string;
  column: ProjectModel['status'];
  data: ProjectModel;
};

export function ProjectsClient({ projects }: ProjectsClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  // Transform database projects to the format expected by components
  const projectsData = useMemo(() => {
    return projects.map((project): ProjectKanbanItem => ({
      id: project.id.toString(),
      name: project.title,
      column: project.status,
      data: {
        id: project.id,
        title: project.title,
        description: project.description,
        startDate: project.startDate,
        endDate: project.endDate,
        status: project.status,
        nature: project.nature,
        company: {
          id: project.company.id,
          name: project.company.name,
          email: project.company.email,
          phoneNumber: project.company.phoneNumber,
          nif: project.company.nif,
          employeeCount: project.company.employeeCount,
          projectsCount: 0, // We can calculate this if needed
        },
      },
    }));
  }, [projects]);

  // Calculate kanban columns with dynamic counts
  const kanbanColumns = useMemo(() => [
    {
      id: 'UNCONTROLLED',
      name: 'Non contrôlés',
      count: projectsData.filter((p) => p.column === 'UNCONTROLLED').length,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      id: 'CONTROLLED_IN_PROGRESS',
      name: 'Contrôlés - En cours',
      count: projectsData.filter((p) => p.column === 'CONTROLLED_IN_PROGRESS').length,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
    {
      id: 'CONTROLLED_DELIVERED',
      name: 'Contrôlés - Livrés',
      count: projectsData.filter((p) => p.column === 'CONTROLLED_DELIVERED').length,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      id: 'CONTROLLED_OTHER',
      name: 'Contrôlés - Autre',
      count: projectsData.filter((p) => p.column === 'CONTROLLED_OTHER').length,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
    {
      id: 'DISPUTED',
      name: 'En Litige',
      count: projectsData.filter((p) => p.column === 'DISPUTED').length,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
  ], [projectsData]);

  const [currentProjectsData, setCurrentProjectsData] = useState<ProjectKanbanItem[]>(projectsData);

  // Update projects data when the props change
  useEffect(() => {
    setCurrentProjectsData(projectsData);
  }, [projectsData]);

  const filteredProjects = currentProjectsData.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 space-y-6 p-6">
      <ProjectHeader 
        viewMode={viewMode} 
        onViewModeChange={setViewMode} 
      />
      
      <ProjectSearch 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
      />

      {viewMode === 'kanban' ? (
        <ProjectKanbanView 
          columns={kanbanColumns}
          projects={filteredProjects}
          onProjectsChange={setCurrentProjectsData}
        />
      ) : (
        <ProjectListTable 
          projects={filteredProjects}
          searchQuery={searchQuery}
        />
      )}
    </div>
  );
}
