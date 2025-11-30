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
import { removeMember } from "@/actions/organization/remove-member";

import type { Organization } from "../types";

interface RemoveMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Organization["members"][0] | null;
  organizationId: string;
}

export const RemoveMemberDialog = ({
  open,
  onOpenChange,
  member,
  organizationId,
}: RemoveMemberDialogProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRemoveMember = async () => {
    if (!member) return;

    startTransition(async () => {
      const result = await removeMember(member.id, organizationId);
      if (result.success) {
        toast.success(result.message || "Membre retiré avec succès");
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(result.error || "Erreur lors du retrait du membre");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Retirer le membre</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir retirer <strong>{member?.user.name}</strong> de l'organisation ?
            Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={handleRemoveMember} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Retirer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

