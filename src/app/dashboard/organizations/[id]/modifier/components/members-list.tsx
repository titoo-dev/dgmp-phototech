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
import { Trash2, Users } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import type { Organization } from "../types";
import { getRoleBadgeVariant, getRoleDisplayName } from "../utils";
import { RemoveMemberDialog } from "./remove-member-dialog";

interface MembersListProps {
  members: Organization["members"];
  organizationId: string;
}

export const MembersList = ({ members, organizationId }: MembersListProps) => {
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Organization["members"][0] | null>(null);

  const handleRemoveClick = (member: Organization["members"][0]) => {
    setSelectedMember(member);
    setRemoveDialogOpen(true);
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Membres de l'organisation ({members.length})
          </CardTitle>
          <CardDescription>
            Liste des membres actuels de l'organisation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Aucun membre</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Invitez des membres pour commencer à collaborer
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Membre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Date d'ajout</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {member.user.image ? (
                          <img
                            src={member.user.image}
                            alt={member.user.name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                            <Users className="h-4 w-4" />
                          </div>
                        )}
                        {member.user.name}
                      </div>
                    </TableCell>
                    <TableCell>{member.user.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(member.role) as any}>
                        {getRoleDisplayName(member.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(member.createdAt), "dd MMM yyyy", { locale: fr })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveClick(member)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <RemoveMemberDialog
        open={removeDialogOpen}
        onOpenChange={setRemoveDialogOpen}
        member={selectedMember}
        organizationId={organizationId}
      />
    </>
  );
};

