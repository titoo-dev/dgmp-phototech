import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

const InvitationPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const invitation = await prisma.invitation.findUnique({
    where: { id },
  });

  if (!invitation) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Invitation introuvable</h1>
          <p className="mt-2 text-muted-foreground">
            Cette invitation n'existe pas ou a été supprimée.
          </p>
        </div>
      </div>
    );
  }

  if (invitation.status === "accepted") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-600">Invitation déjà acceptée</h1>
          <p className="mt-2 text-muted-foreground">
            Vous êtes déjà membre de cette organisation.
          </p>
        </div>
      </div>
    );
  }

  if (invitation.status === "rejected") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Invitation refusée</h1>
          <p className="mt-2 text-muted-foreground">
            Cette invitation a été refusée.
          </p>
        </div>
      </div>
    );
  }

  if (new Date(invitation.expiresAt) < new Date()) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Invitation expirée</h1>
          <p className="mt-2 text-muted-foreground">
            Cette invitation a expiré le {new Date(invitation.expiresAt).toLocaleDateString("fr-FR")}.
          </p>
        </div>
      </div>
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: invitation.email },
  });

  if (existingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-orange-600">Compte déjà existant</h1>
          <p className="mt-2 text-muted-foreground">
            Un compte existe déjà avec l'email {invitation.email}.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Veuillez contacter l'administrateur pour être ajouté à l'organisation.
          </p>
        </div>
      </div>
    );
  }

  redirect(`/auth/signup?invitationId=${id}&email=${encodeURIComponent(invitation.email)}`);
};

export default InvitationPage;

