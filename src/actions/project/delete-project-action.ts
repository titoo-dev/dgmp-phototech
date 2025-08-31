'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import prisma from '@/lib/prisma';

// Schema for delete project action
const DeleteProjectSchema = z.object({
    id: z.string().cuid('ID du projet invalide'),
});

type DeleteProjectResult = {
    success: boolean;
    error?: string;
    message?: string;
};

/**
 * Server action to delete a project
 */
export async function deleteProjectAction(
    projectId: string
): Promise<DeleteProjectResult> {
    try {
        // Validate input
        const validatedData = DeleteProjectSchema.parse({ id: projectId });

        // Check if project exists
        const existingProject = await prisma.project.findUnique({
            where: { id: validatedData.id },
            include: {
                missionProjects: {
                    select: { id: true },
                },
            },
        });

        if (!existingProject) {
            return {
                success: false,
                error: 'Projet introuvable.',
            };
        }

        // Check if project has associated mission projects
        if (existingProject.missionProjects.length > 0) {
            return {
                success: false,
                error: 'Impossible de supprimer ce projet car il a des missions associées. Veuillez d\'abord supprimer ou réassigner les missions.',
            };
        }

        // Delete the project
        await prisma.project.delete({
            where: { id: validatedData.id },
        });

        revalidatePath('/projects');

        return {
            success: true,
            message: 'Projet supprimé avec succès.',
        };

    } catch (error) {
        console.error('Error deleting project:', error);

        // Handle Zod validation errors
        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: 'Données invalides: ' + error.issues,
            };
        }

        // Handle Prisma errors
        if (error && typeof error === 'object' && 'code' in error) {
            switch (error.code) {
                case 'P2025':
                    return {
                        success: false,
                        error: 'Projet introuvable.',
                    };
                case 'P2003':
                    return {
                        success: false,
                        error: 'Impossible de supprimer ce projet car il est référencé par d\'autres données.',
                    };
                default:
                    return {
                        success: false,
                        error: 'Erreur de base de données.',
                    };
            }
        }

        return {
            success: false,
            error: 'Une erreur inattendue s\'est produite lors de la suppression.',
        };
    }
}
