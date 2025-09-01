"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CreateMissionSchema, type CreateMission } from "../../models/mission-schema";
import prisma from "@/lib/prisma";
import { MissionStatus } from "@/lib/generated/prisma";

export type CreateMissionState = {
  errors?: Record<string, string[]>;
  success?: boolean;
  data?: CreateMission | Record<string, unknown>;
};

function generateMissionNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const stamp = now.getTime().toString().slice(-6);
  return `MIS-${year}-${stamp}`;
}

export async function createMissionAction(
  prevState: CreateMissionState,
  formData: FormData
): Promise<CreateMissionState> {
  console.log('createMissionAction called with formData:');
  for (const [key, value] of formData.entries()) {
    console.log(`  ${key}: ${value}`);
  }
  
  const raw = {
    missionNumber: formData.get("missionNumber"),
    teamLeaderId: formData.get("teamLeaderId"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    location: formData.get("location"),
    status: formData.get("status"),
    agentCount: formData.get("agentCount"),
    marketCount: formData.get("marketCount"),
  };

  console.log('Raw form data received:', raw);

  // If missionNumber not provided, generate one
  const missionNumber = raw.missionNumber ? String(raw.missionNumber) : generateMissionNumber();

  const parsed = {
    missionNumber,
    teamLeaderId: raw.teamLeaderId ? String(raw.teamLeaderId) : undefined,
    startDate: raw.startDate ? new Date(raw.startDate as string) : undefined,
    endDate: raw.endDate ? new Date(raw.endDate as string) : undefined,
    location: raw.location ? String(raw.location) : undefined,
    status: raw.status ? String(raw.status) : 'DRAFT',
    agentCount: raw.agentCount ? Number(raw.agentCount) : 0,
    marketCount: raw.marketCount ? Number(raw.marketCount) : 0,
    members: [], // For now, empty array as required by schema
  };

  console.log('Parsed data:', parsed);

  const validation = CreateMissionSchema.safeParse(parsed);

  if (!validation.success) {
    console.log('Validation errors:', validation.error.flatten().fieldErrors);
    return {
      errors: validation.error.flatten().fieldErrors,
      success: false,
      data: parsed,
    };
  }

  const data = validation.data as CreateMission;

  try {
    // Prisma expects MissionStatus enum values (uppercase). Ensure status is set accordingly.
    const statusValue = (data.status as unknown as MissionStatus) || ("DRAFT" as MissionStatus);

    const mission = await prisma.mission.create({
      data: {
        missionNumber: missionNumber as string,
        teamLeader: { connect: { id: data.teamLeaderId } },
        startDate: data.startDate,
        endDate: data.endDate,
        location: data.location,
        status: statusValue,
        agentCount: data.agentCount,
        marketCount: data.marketCount,
      },
      include: {
        teamLeader: true,
      },
    });

    console.log('Mission created successfully:', mission);

    revalidatePath('/dashboard/missions');
    revalidatePath('/dashboard/missions', 'page');

    return {
      success: true,
      data: mission,
    };
  } catch (error) {
    console.error('Error creating mission:', error);
    return {
      errors: { _form: ['Une erreur est survenue lors de la création de la mission'] },
      success: false,
      data: parsed,
    };
  }
}

export async function createMissionWithRedirectAction(formData: FormData): Promise<void> {
  const result = await createMissionAction({}, formData);
  if (result.success) redirect('/dashboard/missions');
}
