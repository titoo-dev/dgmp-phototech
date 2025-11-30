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
import { Clock, Mail, X } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import type { Invitation } from "../types";
import { getRoleBadgeVariant, getRoleDisplayName } from "../utils";
import { CancelInvitationDialog } from "./cancel-invitation-dialog";

interface PendingInvitationsListProps {
  invitations: Invitation[];
}

export const PendingInvitationsList = ({ invitations }: PendingInvitationsListProps) => {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null);

  const pendingInvitations = invitations.filter(inv => inv.status === 'pending');

  if (pendingInvitations.length === 0) {
    return null;
  }

  const handleCancelClick = (invitation: Invitation) => {
    setSelectedInvitation(invitation);
    setCancelDialogOpen(true);
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Invitations en attente ({pendingInvitations.length})
          </CardTitle>
          <CardDescription>
            Liste des invitations envoyées en attente d'acceptation
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
                    <Badge variant={getRoleBadgeVariant(invitation.role) as any}>
                      {getRoleDisplayName(invitation.role)}
                    </Badge>
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

      <CancelInvitationDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        invitation={selectedInvitation}
      />
    </>
  );
};

