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
import { MissionStatus } from '@/lib/generated/prisma';
import { updateMissionStatusAction } from '@/actions/mission/update-mission-status-action';
import { toast } from 'sonner';
import { getAvailableStatusTransitions, getStatusDisplayName } from '@/lib/helpers/mission-status-helper';

interface MissionStatusDropdownProps {
  missionId: string;
  currentStatus: MissionStatus;
  missionNumber: string;
}

export function MissionStatusDropdown({ missionId, currentStatus, missionNumber }: MissionStatusDropdownProps) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const availableStatuses = getAvailableStatusTransitions(currentStatus);

  const handleStatusChange = (newStatus: MissionStatus) => {
    setIsOpen(false);
    startTransition(async () => {
      const result = await updateMissionStatusAction(missionId, newStatus);
      
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

  const getStatusColor = (status: MissionStatus) => {
    switch (status) {
      case MissionStatus.DRAFT:
        return 'text-blue-600';
      case MissionStatus.PENDING:
        return 'text-yellow-600';
      case MissionStatus.COMPLETED:
        return 'text-green-600';
      case MissionStatus.REJECTED:
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
          Changer le statut de #{missionNumber}
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
