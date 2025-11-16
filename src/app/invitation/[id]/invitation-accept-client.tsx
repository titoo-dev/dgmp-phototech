"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Shield, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

type Invitation = {
  id: string;
  email: string;
  role: string | null;
  status: string;
  expiresAt: Date;
  organizationId: string;
  inviterId: string;
  organization: {
    id: string;
    name: string;
    slug: string | null;
    logo: string | null;
    createdAt: Date;
    metadata: string | null;
  };
  inviter: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
};

type InvitationAcceptClientProps = {
  invitation: Invitation;
};

const getRoleIcon = (role: string | null) => {
  switch (role) {
    case "u4":
    case "u5":
      return <Shield className="h-5 w-5 text-yellow-600" />;
    case "u2":
    case "u3":
      return <Shield className="h-5 w-5 text-blue-600" />;
    case "u1":
      return <Users className="h-5 w-5 text-gray-600" />;
    default:
      return <Users className="h-5 w-5 text-gray-600" />;
  }
};

const getRoleDisplayName = (role: string | null): string => {
  if (!role) return "Agent de terrain";
  
  switch (role) {
    case "u1":
      return "Agent de terrain";
    case "u2":
      return "Responsable missions";
    case "u3":
      return "Rédacteur magazine";
    case "u4":
      return "Administrateur système";
    case "u5":
      return "Gestionnaire organisation";
    default:
      return role;
  }
};

export const InvitationAcceptClient = ({
  invitation,
}: InvitationAcceptClientProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [action, setAction] = useState<"accept" | "reject" | null>(null);

  const handleAccept = () => {
    setAction("accept");
    startTransition(async () => {
      try {
        const result = await authClient.organization.acceptInvitation({
          invitationId: invitation.id,
        });

        if (result.error) {
          toast.error(result.error.message || "Erreur lors de l'acceptation de l'invitation");
          setAction(null);
          return;
        }

        toast.success("Invitation acceptée avec succès");
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1000);
      } catch (error: any) {
        console.error("Error accepting invitation:", error);
        toast.error(error?.message || "Erreur lors de l'acceptation de l'invitation");
        setAction(null);
      }
    });
  };

  const handleReject = () => {
    setAction("reject");
    startTransition(async () => {
      try {
        const result = await authClient.organization.rejectInvitation({
          invitationId: invitation.id,
        });

        if (result.error) {
          toast.error(result.error.message || "Erreur lors du refus de l'invitation");
          setAction(null);
          return;
        }

        toast.success("Invitation refusée");
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1000);
      } catch (error: any) {
        console.error("Error rejecting invitation:", error);
        toast.error(error?.message || "Erreur lors du refus de l'invitation");
        setAction(null);
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {invitation.organization.logo ? (
              <div className="relative h-20 w-20 rounded-lg overflow-hidden">
                <Image
                  src={invitation.organization.logo}
                  alt={invitation.organization.name}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-muted">
                <Building2 className="h-10 w-10 text-muted-foreground" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl">Invitation à rejoindre une organisation</CardTitle>
          <CardDescription>
            Vous avez été invité à rejoindre l'organisation <strong>{invitation.organization.name}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Organisation</p>
                  <p className="text-lg font-semibold">{invitation.organization.name}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                {getRoleIcon(invitation.role)}
                <div>
                  <p className="text-sm font-medium">Rôle assigné</p>
                  <Badge variant="outline" className="mt-1">
                    {getRoleDisplayName(invitation.role)}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                {invitation.inviter.image ? (
                  <img
                    src={invitation.inviter.image}
                    alt={invitation.inviter.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                    <Users className="h-5 w-5 text-gray-600" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium">Invité par</p>
                  <p className="text-base font-semibold">{invitation.inviter.name}</p>
                  <p className="text-sm text-muted-foreground">{invitation.inviter.email}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="text-yellow-600">⏰</div>
                <div>
                  <p className="text-sm font-medium">Expire le</p>
                  <p className="text-base font-semibold">
                    {new Date(invitation.expiresAt).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleReject}
              disabled={isPending}
            >
              {isPending && action === "reject" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Refus en cours...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Refuser
                </>
              )}
            </Button>
            <Button
              className="flex-1"
              onClick={handleAccept}
              disabled={isPending}
            >
              {isPending && action === "accept" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Acceptation en cours...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Accepter l'invitation
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

