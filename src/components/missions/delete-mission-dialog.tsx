'use client';

import { useState, useTransition } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteMissionAction } from '@/actions/mission/delete-mission-action';
import { toast } from 'sonner';

interface DeleteMissionDialogProps {
  missionId: string;
  missionNumber: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onDeleteSuccess?: () => void;
}

export function DeleteMissionDialog({ 
  missionId, 
  missionNumber, 
  trigger, 
  open: externalOpen, 
  onOpenChange: externalOnOpenChange,
  onDeleteSuccess
}: DeleteMissionDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Use external state if provided, otherwise use internal state
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsOpen = externalOnOpenChange || setInternalOpen;

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteMissionAction(missionId);
      
      if (result.success) {
        toast.success('Mission supprimée', {
          description: result.message,
          duration: 3000,
        });
        setIsOpen(false);
        if (onDeleteSuccess) {
          onDeleteSuccess();
        }
      } else {
        toast.error('Erreur', {
          description: result.errors?._form?.[0] || 'Impossible de supprimer la mission',
          duration: 5000,
        });
      }
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && (
        <div onClick={() => setIsOpen(true)}>
          {trigger}
        </div>
      )}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer la mission #{missionNumber}</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer cette mission ? Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Suppression...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
