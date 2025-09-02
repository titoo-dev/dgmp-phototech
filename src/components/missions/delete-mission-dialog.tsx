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
}

export function DeleteMissionDialog({ missionId, missionNumber, trigger }: DeleteMissionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteMissionAction(missionId);
      
      if (result.success) {
        toast.success('Mission supprimée', {
          description: result.message,
          duration: 3000,
        });
        setIsOpen(false);
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
      <div onClick={() => setIsOpen(true)}>
        {trigger || (
          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer
          </Button>
        )}
      </div>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer la mission #{missionNumber}</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer cette mission ? Cette action est irréversible et supprimera également :
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Tous les projets associés à cette mission</li>
              <li>Tous les fichiers uploadés</li>
              <li>Toutes les données de la mission</li>
            </ul>
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
                Supprimer définitivement
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
