"use server";

import prisma from "@/lib/prisma";
import { getSessionAction } from "@/actions/get-session";

export const cancelInvitation = async (invitationId: string) => {
  try {
    const { session, user } = await getSessionAction();

    if (!session || !user) {
      return {
        success: false,
        error: "Vous devez être connecté pour annuler une invitation",
      };
    }

    if (user.role !== "u4" && user.role !== "u5") {
      return {
        success: false,
        error: "Vous n'avez pas les permissions nécessaires pour annuler une invitation",
      };
    }

    const invitation = await prisma.invitation.findUnique({
      where: {
        id: invitationId,
      },
    });

    if (!invitation) {
      return {
        success: false,
        error: "Invitation introuvable",
      };
    }

    await prisma.invitation.update({
      where: {
        id: invitationId,
      },
      data: {
        status: "canceled",
      },
    });

    return {
      success: true,
      message: "Invitation annulée avec succès",
    };
  } catch (error: any) {
    console.error("Error canceling invitation:", error);
    return {
      success: false,
      error: error?.message || "Une erreur est survenue lors de l'annulation de l'invitation",
    };
  }
};

