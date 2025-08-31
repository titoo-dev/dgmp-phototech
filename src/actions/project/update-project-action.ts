'use server';

import { revalidatePath } from 'next/cache';
import {
	UpdateProjectFormSchema,
	type UpdateProjectForm,
} from '@/models/project-schema';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { ProjectNature, ProjectStatus } from '@/lib/generated/prisma';

export type UpdateProjectState = {
	errors?: {
		title?: string[];
		description?: string[];
		startDate?: string[];
		endDate?: string[];
		companyId?: string[];
		nature?: string[];
		status?: string[];
		_form?: string[];
	};
	success?: boolean;
	data?: UpdateProjectForm;
};

/**
 * Server action to update an existing project
 */
export async function updateProjectAction(
	prevState: UpdateProjectState,
	formData: FormData
): Promise<UpdateProjectState> {
	const rawData = {
		id: formData.get('id'),
		title: formData.get('title'),
		description: formData.get('description'),
		startDate: formData.get('startDate'),
		endDate: formData.get('endDate'),
		companyId: formData.get('companyId'),
		nature: formData.get('nature'),
		status: formData.get('status'),
	};

	const parsed = {
		id: rawData.id as string | undefined,
		title: rawData.title as string | undefined,
		description: rawData.description as string | undefined,
		startDate: rawData.startDate ? new Date(rawData.startDate as string) : undefined,
		endDate: rawData.endDate ? new Date(rawData.endDate as string) : undefined,
		companyId: rawData.companyId as string | undefined,
		nature: rawData.nature as string | undefined,
		status: rawData.status as string | undefined,
	};

	const validationResult = UpdateProjectFormSchema.safeParse(parsed);

	if (!validationResult.success) {
		return {
			errors: validationResult.error.flatten().fieldErrors,
			success: false,
			data: parsed as UpdateProjectForm,
		};
	}

	const validated = validationResult.data;

	try {
		const existing = await prisma.project.findUnique({
			where: { id: validated.id },
		});
		if (!existing) {
			return {
				errors: { _form: ['Projet introuvable'] },
				success: false,
				data: validated,
			};
		}

		// Validate company exists if companyId is being changed
		if (validated.companyId && validated.companyId !== existing.companyId) {
			const company = await prisma.company.findUnique({
				where: { id: validated.companyId },
			});

			if (!company) {
				return {
					errors: {
						_form: ['Entreprise introuvable'],
					},
					success: false,
					data: validated,
				};
			}
		}

		const updateData: any = {};
		if (typeof validated.title !== 'undefined')
			updateData.title = validated.title;
		if (typeof validated.description !== 'undefined')
			updateData.description = validated.description;
		if (typeof validated.startDate !== 'undefined')
			updateData.startDate = validated.startDate;
		if (typeof validated.endDate !== 'undefined')
			updateData.endDate = validated.endDate;
		if (typeof validated.companyId !== 'undefined')
			updateData.companyId = validated.companyId;
		if (typeof validated.nature !== 'undefined')
			updateData.nature = validated.nature as ProjectNature;
		if (typeof validated.status !== 'undefined')
			updateData.status = validated.status as ProjectStatus;

		const project = await prisma.project.update({
			where: { id: validated.id },
			data: updateData,
		});

		revalidatePath('/projects');
		revalidatePath('/(client)/projects', 'page');

		return { success: true, data: project as unknown as UpdateProjectForm };
	} catch (error) {
		console.error('Error updating project:', error);
		return {
			errors: {
				_form: [
					'Une erreur est survenue lors de la mise à jour du projet',
				],
			},
			success: false,
			data: validated,
		};
	}
}

export async function updateProjectWithRedirectAction(formData: FormData) {
	const res = await updateProjectAction({}, formData);
	if (res.success) redirect('/projects');
}
