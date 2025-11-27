"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CreateMissionSchema, type CreateMission } from "../../models/mission-schema";
import prisma from "@/lib/prisma";
import { put } from '@vercel/blob';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { requireOrganization } from "@/lib/auth-guard";


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

export async function uploadPhotoFile(file: File): Promise<{ url: string; metadata: any }> {
  // Validate file type (images only)
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed');
  }

  // Generate a unique filename
  const fileExtension = file.name.split('.').pop() || 'jpg';
  const filename = `mission-photo.${fileExtension}`;

  // Upload to Vercel Blob
  const blob = await put(filename, file, {
    access: 'public',
    addRandomSuffix: true,
    multipart: true,
  });

  return {
    url: blob.url,
    metadata: {
      success: true,
      filename: blob.pathname,
      size: file.size,
      type: file.type,
      ...blob,
    }
  };
}

export async function createMissionAction(
  prevState: CreateMissionState,
  formData: FormData
): Promise<CreateMissionState> {

  const { session, organizationId, user } = await requireOrganization();

  const raw = {
    teamLeaderId: user?.id as string,
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    location: formData.get("location"),
    memberIds: formData.getAll("memberIds"),
    projectsData: formData.get("projectsData"),
  };


  console.log('Raw data:', raw);

  // If missionNumber not provided, generate one
  const missionNumber = generateMissionNumber();

  // Parse projects data
  let projectsData: Array<{ projectId: string, notes: string, marketName: string }> = [];
  try {
    if (raw.projectsData) {
      projectsData = JSON.parse(raw.projectsData as string);
    }
  } catch (error) {
    console.error('Failed to parse projects data:', error);
  }

  // Remove duplicates from memberIds
  const uniqueMemberIds = Array.isArray(raw.memberIds)
    ? [...new Set(raw.memberIds.map(id => String(id)))]
    : [];

  // Auto-calculate agentCount (members + 1 team leader)
  const agentCount = uniqueMemberIds.length + 1;

  // Auto-calculate marketCount from projectsData length
  const marketCount = projectsData.length;

  // Extract photo files from FormData
  const photoFiles: { [marketName: string]: File[] } = {};
  for (const [key, value] of formData.entries()) {
    if (key.startsWith('photos_')) {
      const marketName = key.replace('photos_', '');
      if (!photoFiles[marketName]) {
        photoFiles[marketName] = [];
      }
      if (value instanceof File) {
        photoFiles[marketName].push(value);
      }
    }
  }

  const parsed = {
    teamLeaderId: raw.teamLeaderId ? String(raw.teamLeaderId) : undefined,
    startDate: raw.startDate ? new Date(raw.startDate as string) : undefined,
    endDate: raw.endDate ? new Date(raw.endDate as string) : undefined,
    location: raw.location ? String(raw.location) : undefined,
    agentCount: agentCount,
    marketCount: marketCount,
    members: uniqueMemberIds,
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

    const mission = await prisma.mission.create({
      data: {
        missionNumber: missionNumber as string,
        teamLeader: { connect: { id: user?.id as string } },
        members: data.members && data.members.length > 0 ? {
          connect: data.members.map(memberId => ({ id: memberId }))
        } : undefined,
        startDate: data.startDate,
        endDate: data.endDate,
        location: data.location,
        status: 'DRAFT',
        agentCount: data.agentCount,
        marketCount: data.marketCount,
        organization: { connect: { id: organizationId } },
      },
      include: {
        teamLeader: true,
        members: true,
      },
    });

    // Create MissionProject entries and upload photos
    if (projectsData.length > 0) {
      const missionProjects = await Promise.all(
        projectsData.map(projectData =>
          prisma.missionProject.create({
            data: {
              missionId: mission.id,
              projectId: projectData.projectId,
              notes: projectData.notes,
            },
          })
        )
      );

      // Upload photos and create MissionFile entries
      for (const projectData of projectsData) {
        const missionProject = missionProjects.find(mp => mp.projectId === projectData.projectId);
        if (!missionProject) continue;

        const marketPhotos = photoFiles[projectData.marketName] || [];

        for (const photoFile of marketPhotos) {
          try {
            const uploadResult = await uploadPhotoFile(photoFile);

            await prisma.missionFile.create({
              data: {
                fileUrl: uploadResult.url,
                metadata: JSON.stringify(uploadResult.metadata),
                missionProjectId: missionProject.id,
              },
            });
          } catch (error) {
            console.error('Failed to upload photo:', error);
            // Continue with other photos even if one fails
          }
        }
      }
    }

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
