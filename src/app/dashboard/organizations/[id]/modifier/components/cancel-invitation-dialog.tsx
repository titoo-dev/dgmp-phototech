"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cancelInvitation } from "@/actions/organization/cancel-invitation";

import type { Invitation } from "../types";

interface CancelInvitationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invitation: Invitation | null;
}

export const CancelInvitationDialog = ({
  open,
  onOpenChange,
  invitation,
}: CancelInvitationDialogProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleCancelInvitation = async () => {
    if (!invitation) return;

    startTransition(async () => {
      const result = await cancelInvitation(invitation.id);
      if (result.success) {
        toast.success(result.message || "Invitation annulée avec succès");
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(result.error || "Erreur lors de l'annulation de l'invitation");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Annuler l'invitation</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir annuler l'invitation envoyée à <strong>{invitation?.email}</strong> ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={handleCancelInvitation} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

