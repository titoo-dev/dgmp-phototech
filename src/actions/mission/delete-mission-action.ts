"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export type DeleteMissionState = {
  errors?: Record<string, string[]>;
  success?: boolean;
  message?: string;
};

export async function deleteMissionAction(
  missionId: string
): Promise<DeleteMissionState> {
  try {
    // Validate input
    if (!missionId || typeof missionId !== 'string') {
      return {
        errors: { _form: ['ID de mission invalide'] },
        success: false,
      };
    }

    // Check if mission exists and get mission number for the success message
    const existingMission = await prisma.mission.findUnique({
      where: { id: missionId },
      select: { 
        id: true, 
        missionNumber: true,
        missionProjects: {
          select: {
            id: true,
            files: {
              select: { id: true }
            }
          }
        }
      }
    });

    if (!existingMission) {
      return {
        errors: { _form: ['Mission introuvable'] },
        success: false,
      };
    }

    // Delete in the correct order to respect foreign key constraints
    // 1. Delete MissionFiles first
    for (const missionProject of existingMission.missionProjects) {
      if (missionProject.files.length > 0) {
        await prisma.missionFile.deleteMany({
          where: { missionProjectId: missionProject.id }
        });
      }
    }

    // 2. Delete MissionProjects
    await prisma.missionProject.deleteMany({
      where: { missionId: missionId }
    });

    // 3. Finally delete the Mission
    await prisma.mission.delete({
      where: { id: missionId },
    });

    // Revalidate the missions page
    revalidatePath('/dashboard/missions');
    revalidatePath('/dashboard/missions', 'page');

    return {
      success: true,
      message: `Mission #${existingMission.missionNumber} supprimée avec succès`,
    };
  } catch (error) {
    console.error('Error deleting mission:', error);
    return {
      errors: { _form: ['Une erreur est survenue lors de la suppression de la mission'] },
      success: false,
    };
  }
}