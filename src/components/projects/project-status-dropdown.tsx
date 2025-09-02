'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Loader2 } from 'lucide-react';
import { ProjectStatus } from '@/lib/generated/prisma';
import { updateProjectStatusAction } from '@/actions/project/update-project-status-action';
import { toast } from 'sonner';
import { getAvailableStatusTransitions, getStatusDisplayName } from '@/lib/helpers/project-status-helper';

interface ProjectStatusDropdownProps {
  projectId: string;
  currentStatus: ProjectStatus;
  projectTitle: string;
}

export function ProjectStatusDropdown({ projectId, currentStatus, projectTitle }: ProjectStatusDropdownProps) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const availableStatuses = getAvailableStatusTransitions(currentStatus);

  const handleStatusChange = (newStatus: ProjectStatus) => {
    setIsOpen(false);
    startTransition(async () => {
      const result = await updateProjectStatusAction(projectId, newStatus);
      
      if (result.success) {
        toast.success('Statut mis à jour', {
          description: result.message,
          duration: 3000,
        });
      } else {
        toast.error('Erreur', {
          description: result.errors?._form?.[0] || 'Impossible de mettre à jour le statut',
          duration: 5000,
        });
      }
    });
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.UNCONTROLLED:
        return 'text-blue-600';
      case ProjectStatus.CONTROLLED_IN_PROGRESS:
        return 'text-orange-600';
      case ProjectStatus.CONTROLLED_DELIVERED:
        return 'text-green-600';
      case ProjectStatus.CONTROLLED_OTHER:
        return 'text-yellow-600';
      case ProjectStatus.DISPUTED:
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (availableStatuses.length === 0) {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        className={`h-6 text-xs ${getStatusColor(currentStatus)} cursor-default`}
        disabled
      >
        {getStatusDisplayName(currentStatus)}
      </Button>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`h-6 text-xs ${getStatusColor(currentStatus)} hover:bg-muted/50`}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="w-3 h-3 animate-spin mr-1" />
          ) : (
            <>
              {getStatusDisplayName(currentStatus)}
              <ChevronDown className="w-3 h-3 ml-1" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-xs">
          Changer le statut de "{projectTitle}"
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availableStatuses.map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => handleStatusChange(status)}
            className={`text-xs ${getStatusColor(status)}`}
          >
            {getStatusDisplayName(status)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
