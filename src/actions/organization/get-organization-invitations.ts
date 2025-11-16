"use server";

import prisma from "@/lib/prisma";
import { getSessionAction } from "@/actions/get-session";

type InvitationWithInviter = {
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

export const getOrganizationInvitations = async (organizationId: string): Promise<{
  success: boolean;
  data?: InvitationWithInviter[];
  error?: string;
}> => {
  try {
    const { session, user } = await getSessionAction();

    if (!session || !user) {
      return {
        success: false,
        error: "Vous devez être connecté pour voir les invitations",
      };
    }

    if (user.role !== "u5") {
      return {
        success: false,
        error: "Vous n'avez pas les permissions nécessaires pour voir les invitations",
      };
    }

    const invitations = await prisma.invitation.findMany({
      where: {
        organizationId,
      },
      orderBy: {
        expiresAt: "desc",
      },
    });

    const invitationsWithInviter = await Promise.all(
      invitations.map(async (invitation) => {
        const inviter = await prisma.user.findUnique({
          where: { id: invitation.inviterId },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        });

        return {
          ...invitation,
          inviter: inviter || {
            id: invitation.inviterId,
            name: "Utilisateur supprimé",
            email: "",
            image: null,
          },
        };
      })
    );

    return {
      success: true,
      data: invitationsWithInviter,
    };
  } catch (error) {
    console.error("Error getting organization invitations:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la récupération des invitations",
    };
  }
};

