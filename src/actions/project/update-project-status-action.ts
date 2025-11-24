"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { ProjectStatus } from "@/lib/generated/prisma";
import { requireOrganization } from "@/lib/auth-guard";

export type UpdateProjectStatusState = {
  errors?: Record<string, string[]>;
  success?: boolean;
  message?: string;
};

export async function updateProjectStatusAction(
  projectId: string,
  newStatus: ProjectStatus
): Promise<UpdateProjectStatusState> {
  try {
    // Validate inputs
    if (!projectId || typeof projectId !== 'string') {
      return {
        errors: { _form: ['ID de marché invalide'] },
        success: false,
      };
    }

    if (!newStatus || !Object.values(ProjectStatus).includes(newStatus)) {
      return {
        errors: { _form: ['Statut invalide'] },
        success: false,
      };
    }

    const { organizationId } = await requireOrganization();

    // Check if project exists
    const existingProject = await prisma.project.findFirst({
      where: {
        id: projectId,
        organizationId
      },
      select: { id: true, status: true, title: true }
    });

    if (!existingProject) {
      return {
        errors: { _form: ['Marché introuvable'] },
        success: false,
      };
    }

    // Update project status
    await prisma.project.update({
      where: { id: projectId },
      data: { status: newStatus },
    });

    // Revalidate the projects page to show updated data
    revalidatePath('/dashboard/projects');
    revalidatePath('/dashboard/projects', 'page');

    return {
      success: true,
      message: `Statut du marché "${existingProject.title}" mis à jour avec succès`,
    };
  } catch (error) {
    console.error('Error updating market status:', error);
    return {
      errors: { _form: ['Une erreur est survenue lors de la mise à jour du statut du marché'] },
      success: false,
    };
  }
}
