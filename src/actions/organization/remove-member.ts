"use server";

import prisma from "@/lib/prisma";
import { getSessionAction } from "@/actions/get-session";

export const removeMember = async (memberId: string, organizationId: string) => {
  try {
    const { session, user } = await getSessionAction();

    if (!session || !user) {
      return {
        success: false,
        error: "Vous devez être connecté pour retirer un membre",
      };
    }

    if (user.role !== "u5") {
      return {
        success: false,
        error: "Vous n'avez pas les permissions nécessaires pour retirer un membre",
      };
    }

    const member = await prisma.member.findUnique({
      where: {
        id: memberId,
      },
    });

    if (!member) {
      return {
        success: false,
        error: "Membre introuvable",
      };
    }

    if (member.organizationId !== organizationId) {
      return {
        success: false,
        error: "Membre n'appartient pas à cette organisation",
      };
    }

    await prisma.member.delete({
      where: {
        id: memberId,
      },
    });

    return {
      success: true,
      message: "Membre retiré avec succès",
    };
  } catch (error: any) {
    console.error("Error removing member:", error);
    return {
      success: false,
      error: error?.message || "Une erreur est survenue lors du retrait du membre",
    };
  }
};

