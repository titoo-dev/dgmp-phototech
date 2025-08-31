'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import prisma from '@/lib/prisma';

// Schema for delete mission action
const DeleteMissionSchema = z.object({
    id: z.string().cuid('ID de la mission invalide'),
});

type DeleteMissionResult = {
    success: boolean;
    error?: string;
    message?: string;
};

/**
 * Server action to delete a mission
 */
export async function deleteMissionAction(
    missionId: string
): Promise<DeleteMissionResult> {
    try {
        // Validate input
        const validatedData = DeleteMissionSchema.parse({ id: missionId });

        // Check if mission exists
        const existingMission = await prisma.mission.findUnique({
            where: { id: validatedData.id },
            include: {
                missionProjects: {
                    select: { id: true },
                },
            },
        });

        if (!existingMission) {
            return {
                success: false,
                error: 'Mission introuvable.',
            };
        }

        // Check if mission has associated mission projects
        if (existingMission.missionProjects.length > 0) {
            return {
                success: false,
                error: 'Impossible de supprimer cette mission car elle a des projets associés. Veuillez d\'abord supprimer ou réassigner les projets.',
            };
        }

        // Delete the mission
        await prisma.mission.delete({
            where: { id: validatedData.id },
        });

        revalidatePath('/missions');

        return {
            success: true,
            message: 'Mission supprimée avec succès.',
        };

    } catch (error) {
        console.error('Error deleting mission:', error);

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
                        error: 'Mission introuvable.',
                    };
                case 'P2003':
                    return {
                        success: false,
                        error: 'Impossible de supprimer cette mission car elle est référencée par d\'autres données.',
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
