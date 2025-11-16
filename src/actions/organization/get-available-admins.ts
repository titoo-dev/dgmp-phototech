"use server";

import prisma from "@/lib/prisma";
import { getSessionAction } from "@/actions/get-session";

/**
 * Get all u4 users that are not already assigned to an organization
 */
export const getAvailableAdmins = async () => {
  try {
    // Check authentication and authorization
    const { session, user } = await getSessionAction();

    if (!session || !user) {
      return {
        success: false,
        error: "Vous devez être connecté pour voir les administrateurs disponibles",
      };
    }

    if (user.role !== "u5") {
      return {
        success: false,
        error:
          "Vous n'avez pas les permissions nécessaires pour voir les administrateurs disponibles",
      };
    }

    // Get all u4 users
    const allAdmins = await prisma.user.findMany({
      where: {
        role: "u4",
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    // Get all user IDs that are already members of an organization
    const assignedMembers = await prisma.member.findMany({
      select: {
        userId: true,
      },
    });

    const assignedUserIds = new Set(assignedMembers.map((m) => m.userId));

    // Filter out users that are already assigned
    const availableAdmins = allAdmins.filter((admin) => !assignedUserIds.has(admin.id));

    return {
      success: true,
      data: availableAdmins,
    };
  } catch (error) {
    console.error("Error getting available admins:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la récupération des administrateurs disponibles",
    };
  }
};
