import { redirect } from "next/navigation";
import { Suspense } from "react";
import prisma from "@/lib/prisma";
import SignUpInvitationClient from "./signup-invitation-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function SignUpInvitationPage({
  params,
  searchParams,
}: {
  params: Promise<{ invitationId: string }>;
  searchParams: Promise<{ email?: string }>;
}) {
  const { invitationId } = await params;
  const { email } = await searchParams;

  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
    include: {
      organization: {
        select: {
          name: true,
          logo: true,
        },
      },
    },
  });

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">
            Invitation introuvable
          </h1>
          <p className="text-muted-foreground">
            Cette invitation n'existe pas ou a été supprimée.
          </p>
        </div>
      </div>
    );
  }


  if (new Date(invitation.expiresAt) < new Date()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">
            Invitation expirée
          </h1>
          <p className="text-muted-foreground">
            Cette invitation a expiré. Veuillez demander une nouvelle invitation.
          </p>
        </div>
      </div>
    );
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: invitation.email },
  });

  if (existingUser) {
    // User already has an account, redirect to signin
    return redirect(`/`);
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpInvitationClient
        invitationId={invitationId}
        email={email || invitation.email}
        organizationName={invitation.organization.name}
        organizationLogo={invitation.organization.logo}
        role={invitation.role || "u1"}
      />
    </Suspense>
  );
}
