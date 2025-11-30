"use client";

import { useActionState, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { inviteMember, InviteMemberFormState } from "@/actions/organization/invite-member";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Loader2,
  UserPlus,
  Mail,
  Shield,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import type { Role } from "../types";

interface InviteMemberFormProps {
  organizationId: string;
}

export const InviteMemberForm = ({ organizationId }: InviteMemberFormProps) => {
  const router = useRouter();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("u1");

  const initialInviteState: InviteMemberFormState = {
    success: false,
  };

  const [inviteState, inviteFormAction, isInvitePending] = useActionState(
    inviteMember,
    initialInviteState
  );

  useEffect(() => {
    if (inviteState.success) {
      toast.success(inviteState.message || "Invitation envoyée avec succès");
      setInviteEmail("");
      setInviteRole("u1");
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } else if (inviteState.message) {
      toast.error(inviteState.message);
    }
  }, [inviteState, router]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Inviter un membre
        </CardTitle>
        <CardDescription>
          Invitez des utilisateurs à rejoindre l'organisation avec un rôle spécifique
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={inviteFormAction} className="space-y-4">
          <input type="hidden" name="organizationId" value={organizationId} />

          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="invite-email">
                Adresse e-mail <span className="text-red-500">*</span>
              </Label>
              <Input
                id="invite-email"
                name="email"
                type="email"
                placeholder="exemple@email.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />
              {inviteState.fieldErrors?.email && (
                <div className="flex items-center gap-2 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <span>{inviteState.fieldErrors.email[0]}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="invite-role">
                Rôle <span className="text-red-500">*</span>
              </Label>
              <Select
                name="role"
                value={inviteRole}
                onValueChange={(value: Role) => setInviteRole(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="u1">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Agent de terrain
                    </div>
                  </SelectItem>
                  <SelectItem value="u2">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Responsable missions
                    </div>
                  </SelectItem>
                  <SelectItem value="u3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Rédacteur magazine
                    </div>
                  </SelectItem>
                  <SelectItem value="u4">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-yellow-600" />
                      Administrateur système
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {inviteState.fieldErrors?.role && (
                <div className="flex items-center gap-2 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <span>{inviteState.fieldErrors.role[0]}</span>
                </div>
              )}
            </div>
          </div>

          <Button type="submit" disabled={isInvitePending}>
            {isInvitePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {!isInvitePending ? <Mail className="mr-2 h-4 w-4" /> : null}
            {isInvitePending ? "Envoi en cours..." : "Envoyer l'invitation"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

