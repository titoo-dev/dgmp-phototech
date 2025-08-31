'use server';

import { revalidatePath } from 'next/cache';
import {
	UpdateMissionFormSchema,
	type UpdateMissionForm,
} from '@/models/mission-schema';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { MissionStatus } from '@/lib/generated/prisma';

export type UpdateMissionState = {
	errors?: {
		missionNumber?: string[];
		teamLeaderId?: string[];
		startDate?: string[];
		endDate?: string[];
		location?: string[];
		agentCount?: string[];
		marketCount?: string[];
		status?: string[];
		_form?: string[];
	};
	success?: boolean;
	data?: UpdateMissionForm;
};

/**
 * Server action to update an existing mission
 */
export async function updateMissionAction(
	prevState: UpdateMissionState,
	formData: FormData
): Promise<UpdateMissionState> {
	const rawData = {
		id: formData.get('id'),
		missionNumber: formData.get('missionNumber'),
		teamLeaderId: formData.get('teamLeaderId'),
		startDate: formData.get('startDate'),
		endDate: formData.get('endDate'),
		location: formData.get('location'),
		agentCount: formData.get('agentCount'),
		marketCount: formData.get('marketCount'),
		status: formData.get('status'),
	};

	const parsed = {
		id: rawData.id as string | undefined,
		missionNumber: rawData.missionNumber as string | undefined,
		teamLeaderId: rawData.teamLeaderId as string | undefined,
		startDate: rawData.startDate ? new Date(rawData.startDate as string) : undefined,
		endDate: rawData.endDate ? new Date(rawData.endDate as string) : undefined,
		location: rawData.location as string | undefined,
		agentCount: rawData.agentCount ? Number(rawData.agentCount) : undefined,
		marketCount: rawData.marketCount ? Number(rawData.marketCount) : undefined,
		status: rawData.status as string | undefined,
		members: [], // For now, empty array as required by schema
	};

	const validationResult = UpdateMissionFormSchema.safeParse(parsed);

	if (!validationResult.success) {
		return {
			errors: validationResult.error.flatten().fieldErrors,
			success: false,
			data: parsed as UpdateMissionForm,
		};
	}

	const validated = validationResult.data;

	try {
		const existing = await prisma.mission.findUnique({
			where: { id: validated.id },
		});
		if (!existing) {
			return {
				errors: { _form: ['Mission introuvable'] },
				success: false,
				data: validated,
			};
		}

		// Check for duplicate mission number (if changed)
		if (validated.missionNumber && validated.missionNumber !== existing.missionNumber) {
			const conflict = await prisma.mission.findFirst({
				where: {
					missionNumber: validated.missionNumber,
					id: { not: validated.id },
				},
			});

			if (conflict) {
				return {
					errors: {
						_form: ['Une mission avec ce numéro existe déjà'],
					},
					success: false,
					data: validated,
				};
			}
		}

		const updateData: any = {};
		if (typeof validated.missionNumber !== 'undefined')
			updateData.missionNumber = validated.missionNumber;
		if (typeof validated.teamLeaderId !== 'undefined')
			updateData.teamLeader = { connect: { id: validated.teamLeaderId } };
		if (typeof validated.startDate !== 'undefined')
			updateData.startDate = validated.startDate;
		if (typeof validated.endDate !== 'undefined')
			updateData.endDate = validated.endDate;
		if (typeof validated.location !== 'undefined')
			updateData.location = validated.location;
		if (typeof validated.agentCount !== 'undefined')
			updateData.agentCount = validated.agentCount;
		if (typeof validated.marketCount !== 'undefined')
			updateData.marketCount = validated.marketCount;
		if (typeof validated.status !== 'undefined')
			updateData.status = validated.status as MissionStatus;

		const mission = await prisma.mission.update({
			where: { id: validated.id },
			data: updateData,
		});

		revalidatePath('/missions');
		revalidatePath('/(client)/missions', 'page');

		return { success: true, data: mission as unknown as UpdateMissionForm };
	} catch (error) {
		console.error('Error updating mission:', error);
		return {
			errors: {
				_form: [
					'Une erreur est survenue lors de la mise à jour de la mission',
				],
			},
			success: false,
			data: validated,
		};
	}
}

export async function updateMissionWithRedirectAction(formData: FormData) {
	const res = await updateMissionAction({}, formData);
	if (res.success) redirect('/missions');
}
