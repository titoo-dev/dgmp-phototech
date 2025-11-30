"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Mail, X, Shield, User, Edit } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cancelInvitation } from "@/actions/organization/cancel-invitation";

type Invitation = {
  id: string;
  email: string;
  role: string | null;
  status: string;
  expiresAt: Date;
  organizationId: string;
  inviterId: string;
  inviter: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
};

interface PendingInvitationsCardProps {
  invitations: Invitation[];
}

export const PendingInvitationsCard = ({ invitations }: PendingInvitationsCardProps) => {
  const router = useRouter();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null);
  const [isPending, setIsPending] = useState(false);

  const pendingInvitations = invitations.filter(inv => inv.status === 'pending');

  if (pendingInvitations.length === 0) {
    return null;
  }

  const handleCancelClick = (invitation: Invitation) => {
    setSelectedInvitation(invitation);
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedInvitation) return;

    setIsPending(true);
    
    const result = await cancelInvitation(selectedInvitation.id);

    if (result.success) {
      toast.success(result.message || "Invitation annulée avec succès");
      setCancelDialogOpen(false);
      setSelectedInvitation(null);
      router.refresh();
    } else {
      toast.error(result.error || "Erreur lors de l'annulation de l'invitation");
    }
    setIsPending(false);
  };

  const getRoleBadge = (role: string | null) => {
    switch (role) {
      case "u1":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <User className="w-3 h-3 mr-1" />
            Agent terrain
          </Badge>
        );
      case "u2":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            <Shield className="w-3 h-3 mr-1" />
            Responsable
          </Badge>
        );
      case "u3":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <Edit className="w-3 h-3 mr-1" />
            Rédacteur
          </Badge>
        );
      case "u4":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <Shield className="w-3 h-3 mr-1" />
            Administrateur
          </Badge>
        );
      default:
        return <Badge variant="secondary">Agent terrain</Badge>;
    }
  };

  return (
    <>
      <Card className="w-full shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Invitations en attente ({pendingInvitations.length})
          </CardTitle>
          <CardDescription>
            Liste des invitations envoyées en attente d&apos;acceptation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Invité par</TableHead>
                <TableHead>Expire le</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingInvitations.map((invitation) => (
                <TableRow key={invitation.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {invitation.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getRoleBadge(invitation.role)}
                  </TableCell>
                  <TableCell>{invitation.inviter.name}</TableCell>
                  <TableCell>
                    {format(new Date(invitation.expiresAt), "dd MMM yyyy HH:mm", { locale: fr })}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {invitation.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCancelClick(invitation)}
                    >
                      <X className="h-4 w-4 text-red-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler l&apos;invitation</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir annuler l&apos;invitation de {selectedInvitation?.email} ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {isPending ? "Annulation..." : "Confirmer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

