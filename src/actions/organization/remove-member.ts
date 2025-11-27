"use server";

import prisma from "@/lib/prisma";
import { getSessionAction } from "@/actions/get-session";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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
        organizationId_userId: {
          organizationId,
          userId: memberId,
        },
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

    await auth.api.removeMember({
      body: {
        memberIdOrEmail: memberId,
        organizationId
      },
      headers: await headers(),
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

