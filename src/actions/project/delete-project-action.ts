"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export type DeleteProjectState = {
  errors?: Record<string, string[]>;
  success?: boolean;
  message?: string;
};

export async function deleteProjectAction(
  projectId: string
): Promise<DeleteProjectState> {
  try {
    // Validate input
    if (!projectId || typeof projectId !== 'string') {
      return {
        errors: { _form: ['ID de projet invalide'] },
        success: false,
      };
    }

    // Check if project exists and get project title for the success message
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
      select: { 
        id: true, 
        title: true,
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

    if (!existingProject) {
      return {
        errors: { _form: ['Projet introuvable'] },
        success: false,
      };
    }

    // Check if project is associated with missions
    if (existingProject.missionProjects.length > 0) {
      return {
        errors: { _form: ['Impossible de supprimer ce projet car il est associé à des missions'] },
        success: false,
      };
    }

    // Delete the project (no need to delete mission files as we checked there are no associations)
    await prisma.project.delete({
      where: { id: projectId },
    });

    // Revalidate the projects page
    revalidatePath('/dashboard/projects');
    revalidatePath('/dashboard/projects', 'page');

    return {
      success: true,
      message: `Projet "${existingProject.title}" supprimé avec succès`,
    };
  } catch (error) {
    console.error('Error deleting project:', error);
    return {
      errors: { _form: ['Une erreur est survenue lors de la suppression du projet'] },
      success: false,
    };
  }
}