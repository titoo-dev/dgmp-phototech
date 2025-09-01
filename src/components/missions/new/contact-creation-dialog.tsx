"use client";

import * as React from "react";
import { useState, useTransition, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createContactAction } from "@/actions/contact/create-contact-action";
import { Plus, User } from "lucide-react";
import { toast } from "sonner";

interface ContactCreationDialogProps {
  onContactCreated?: () => void;
}

export default function ContactCreationDialog({ onContactCreated }: ContactCreationDialogProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(createContactAction, {});
  const [isPending, startTransition] = useTransition();

  React.useEffect(() => {
    if (state.success) {
      toast.success('Contact créé avec succès', {
        description: 'Le contact a été ajouté à la base de données.',
        duration: 4000,
      });
      setOpen(false);
      onContactCreated?.();
    } else if (state.errors?._form) {
      toast.error('Erreur lors de la création', {
        description: state.errors._form[0],
        duration: 5000,
      });
    }
  }, [state.success, state.errors, onContactCreated]);

  const handleSubmit = (formData: FormData) => {
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Créer contact
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Créer un nouveau contact
          </DialogTitle>
          <DialogDescription>
            Ajoutez un nouveau contact qui pourra être assigné aux missions.
          </DialogDescription>
        </DialogHeader>
        
        <form action={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Entrer le prénom"
                aria-invalid={!!state.errors?.firstName}
              />
              {state.errors?.firstName && (
                <p className="text-sm text-destructive">{state.errors.firstName[0]}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Entrer le nom"
                aria-invalid={!!state.errors?.lastName}
              />
              {state.errors?.lastName && (
                <p className="text-sm text-destructive">{state.errors.lastName[0]}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="entrer@email.com"
                aria-invalid={!!state.errors?.email}
              />
              {state.errors?.email && (
                <p className="text-sm text-destructive">{state.errors.email[0]}</p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Création..." : "Créer le contact"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
