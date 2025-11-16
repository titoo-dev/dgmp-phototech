"use server";

import prisma from "@/lib/prisma";
import { getSessionAction } from "@/actions/get-session";

export const getOrganization = async (organizationId: string) => {
  try {
    // Check authentication and authorization
    const { session, user } = await getSessionAction();

    if (!session || !user) {
      return {
        success: false,
        error: "Vous devez être connecté pour voir une organisation",
      };
    }

    if (user.role !== "u5") {
      return {
        success: false,
        error: "Vous n'avez pas les permissions nécessaires pour voir une organisation",
      };
    }

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                image: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    if (!organization) {
      return {
        success: false,
        error: "Organisation introuvable",
      };
    }

    return {
      success: true,
      data: organization,
    };
  } catch (error) {
    console.error("Error getting organization:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la récupération de l'organisation",
    };
  }
};
