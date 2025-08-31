'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import prisma from '@/lib/prisma';

// Schema for delete company action
const DeleteCompanySchema = z.object({
    id: z.string().cuid('ID de l\'entreprise invalide'),
});

type DeleteCompanyResult = {
    success: boolean;
    error?: string;
    message?: string;
};

/**
 * Server action to delete a company
 * Only accessible to REPORT_MANAGER and ADMIN users
 */
export async function deleteCompanyAction(
    companyId: string
): Promise<DeleteCompanyResult> {
    try {
        // Validate input
        const validatedData = DeleteCompanySchema.parse({ id: companyId });

        // Check if company exists
        const existingCompany = await prisma.company.findUnique({
            where: { id: validatedData.id },
            include: {
                projects: {
                    select: { id: true },
                },
            },
        });

        if (!existingCompany) {
            return {
                success: false,
                error: 'Entreprise introuvable.',
            };
        }

        // Check if company has associated projects
        if (existingCompany.projects.length > 0) {
            return {
                success: false,
                error: 'Impossible de supprimer cette entreprise car elle a des projets associés. Veuillez d\'abord supprimer ou réassigner les projets.',
            };
        }

        // Delete the company
        await prisma.company.delete({
            where: { id: validatedData.id },
        });

        revalidatePath('/companies');

        return {
            success: true,
            message: 'Entreprise supprimée avec succès.',
        };

    } catch (error) {
        console.error('Error deleting company:', error);

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
                        error: 'Entreprise introuvable.',
                    };
                case 'P2003':
                    return {
                        success: false,
                        error: 'Impossible de supprimer cette entreprise car elle est référencée par d\'autres données.',
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
