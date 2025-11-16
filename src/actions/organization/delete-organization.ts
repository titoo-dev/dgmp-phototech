"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getSessionAction } from "@/actions/get-session";
import { headers } from "next/headers";

export const deleteOrganization = async (organizationId: string) => {
  try {
    const { session, user } = await getSessionAction();

    if (!session || !user) {
      return {
        success: false,
        error: "Vous devez être connecté pour supprimer une organisation",
      };
    }

    if (user.role !== "u5") {
      return {
        success: false,
        error: "Vous n'avez pas les permissions nécessaires pour supprimer une organisation",
      };
    }

    const existingOrg = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        members: true,
      },
    });

    if (!existingOrg) {
      return {
        success: false,
        error: "Organisation introuvable",
      };
    }

    await auth.api.deleteOrganization({
      body: { organizationId },
      headers: await headers(),
    });

    return {
      success: true,
      data: { name: existingOrg.name },
    };
  } catch (error: any) {
    console.error("Error deleting organization:", error);
    return {
      success: false,
      error: error?.message || "Une erreur est survenue lors de la suppression de l'organisation",
    };
  }
};
