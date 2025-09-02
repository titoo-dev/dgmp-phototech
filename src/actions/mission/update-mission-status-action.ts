"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { MissionStatus } from "@/lib/generated/prisma";

export type UpdateMissionStatusState = {
  errors?: Record<string, string[]>;
  success?: boolean;
  message?: string;
};

export async function updateMissionStatusAction(
  missionId: string,
  newStatus: MissionStatus
): Promise<UpdateMissionStatusState> {
  try {
    // Validate inputs
    if (!missionId || typeof missionId !== 'string') {
      return {
        errors: { _form: ['ID de mission invalide'] },
        success: false,
      };
    }

    if (!newStatus || !Object.values(MissionStatus).includes(newStatus)) {
      return {
        errors: { _form: ['Statut invalide'] },
        success: false,
      };
    }

    // Check if mission exists
    const existingMission = await prisma.mission.findUnique({
      where: { id: missionId },
      select: { id: true, status: true, missionNumber: true }
    });

    if (!existingMission) {
      return {
        errors: { _form: ['Mission introuvable'] },
        success: false,
      };
    }

    // Update mission status
    await prisma.mission.update({
      where: { id: missionId },
      data: { status: newStatus },
    });

    // Revalidate the missions page to show updated data
    revalidatePath('/dashboard/missions');
    revalidatePath('/dashboard/missions', 'page');

    return {
      success: true,
      message: `Statut de la mission #${existingMission.missionNumber} mis à jour avec succès`,
    };
  } catch (error) {
    console.error('Error updating mission status:', error);
    return {
      errors: { _form: ['Une erreur est survenue lors de la mise à jour du statut'] },
      success: false,
    };
  }
}
