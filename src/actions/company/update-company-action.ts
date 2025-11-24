'use server';

import { revalidatePath } from 'next/cache';
import {
	UpdateCompanyFormSchema,
	type UpdateCompanyForm,
} from '@/models/company-schema';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { requireOrganization } from '@/lib/auth-guard';

export type UpdateCompanyState = {
	errors?: {
		name?: string[];
		email?: string[];
		phoneNumber?: string[];
		nif?: string[];
		employeeCount?: string[];
		_form?: string[];
	};
	success?: boolean;
	data?: UpdateCompanyForm;
};

/**
 * Server action to update an existing company
 */
export async function updateCompanyAction(
	prevState: UpdateCompanyState,
	formData: FormData
): Promise<UpdateCompanyState> {
	const rawData = {
		id: formData.get('id'),
		name: formData.get('name'),
		email: formData.get('email'),
		phoneNumber: formData.get('phoneNumber'),
		nif: formData.get('nif'),
		employeeCount: formData.get('employeeCount'),
	};

	const parsed = {
		id: rawData.id as string | undefined,
		name: rawData.name as string | undefined,
		email: rawData.email as string | undefined,
		phoneNumber: rawData.phoneNumber as string | undefined,
		nif: rawData.nif as string | undefined,
		employeeCount: rawData.employeeCount
			? Number(rawData.employeeCount)
			: undefined,
	};

	const validationResult = UpdateCompanyFormSchema.safeParse(parsed);

	if (!validationResult.success) {
		return {
			errors: validationResult.error.flatten().fieldErrors,
			success: false,
			data: parsed as UpdateCompanyForm,
		};
	}

	const validated = validationResult.data;

	try {
		const { organizationId } = await requireOrganization();

		const existing = await prisma.company.findFirst({
			where: {
				id: validated.id,
				organizationId
			},
		});
		if (!existing) {
			return {
				errors: { _form: ['Entreprise introuvable'] },
				success: false,
				data: validated,
			};
		}

		// Prevent duplicate email or nif (if changed)
		const conflict = await prisma.company.findFirst({
			where: {
				organizationId,
				OR: [{ email: validated.email }, { nif: validated.nif }],
				AND: {
					id: { not: validated.id },
				},
			},
		});

		if (conflict) {
			if (conflict.email === validated.email) {
				return {
					errors: {
						email: ['Une entreprise avec cette adresse email existe déjà'],
					},
					success: false,
					data: validated,
				};
			}

			if (conflict.nif === validated.nif) {
				return {
					errors: {
						nif: ['Une entreprise avec ce NIF existe déjà'],
					},
					success: false,
					data: validated,
				};
			}
		}

		const updateData: Partial<UpdateCompanyForm> = {};
		if (typeof validated.name !== 'undefined')
			updateData.name = validated.name;
		if (typeof validated.email !== 'undefined')
			updateData.email = validated.email;
		if (typeof validated.phoneNumber !== 'undefined')
			updateData.phoneNumber = validated.phoneNumber;
		if (typeof validated.nif !== 'undefined')
			updateData.nif = validated.nif;
		if (typeof validated.employeeCount !== 'undefined')
			updateData.employeeCount = validated.employeeCount;

		const company = await prisma.company.update({
			where: { id: validated.id },
			data: updateData,
		});

		revalidatePath('/companies');
		revalidatePath('/(client)/companies', 'page');

		return { success: true, data: company as unknown as UpdateCompanyForm };
	} catch (error) {
		console.error('Error updating company:', error);
		return {
			errors: {
				_form: [
					'Une erreur est survenue lors de la mise à jour de l&apos;entreprise',
				],
			},
			success: false,
			data: validated,
		};
	}
}

export async function updateCompanyWithRedirectAction(formData: FormData) {
	const res = await updateCompanyAction({}, formData);
	if (res.success) redirect('/companies');
}
