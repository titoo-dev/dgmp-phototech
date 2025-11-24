"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { UpdateMissionFormSchema, type UpdateMissionForm } from "../../models/mission-schema";
import prisma from "@/lib/prisma";
import { uploadPhotoFile } from "./create-mission-action";
import { requireOrganization } from "@/lib/auth-guard";

export type UpdateMissionState = {
  errors?: Record<string, string[]>;
  success?: boolean;
  data?: UpdateMissionForm | Record<string, unknown>;
};

export async function updateMissionAction(
  prevState: UpdateMissionState,
  formData: FormData
): Promise<UpdateMissionState> {

  const raw = {
    id: formData.get("id"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    location: formData.get("location"),
    agentCount: formData.get("agentCount"),
    marketCount: formData.get("marketCount"),
    memberIds: formData.getAll("memberIds"),
    projectsData: formData.get("projectsData"),
    marketData: formData.get("marketData"),
  };

  // Parse projects data
  let projectsData: Array<{ projectId: string, notes: string, marketName: string }> = [];
  try {
    if (raw.projectsData) {
      projectsData = JSON.parse(raw.projectsData as string);
    }
  } catch (error) {
    console.error('Failed to parse projects data:', error);
  }

  // Parse market data with photos
  let marketData: Array<{ name: string, remarks: string, photoCount: number, projectId: string | null }> = [];
  try {
    if (raw.marketData) {
      marketData = JSON.parse(raw.marketData as string);
    }
  } catch (error) {
    console.error('Failed to parse market data:', error);
  }

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

  // Remove duplicates from memberIds
  const uniqueMemberIds = Array.isArray(raw.memberIds)
    ? [...new Set(raw.memberIds.map(id => String(id)))]
    : [];

  // Auto-calculate agentCount (members + 1 team leader) if not provided
  const calculatedAgentCount = uniqueMemberIds.length + 1;

  // Auto-calculate marketCount from projectsData length if not provided
  const calculatedMarketCount = raw.marketCount
    ? Number(raw.marketCount)
    : projectsData.length;

  const { organizationId } = await requireOrganization();

  const parsed = {
    id: raw.id ? String(raw.id) : undefined,
    startDate: raw.startDate ? new Date(raw.startDate as string) : undefined,
    endDate: raw.endDate ? new Date(raw.endDate as string) : undefined,
    location: raw.location ? String(raw.location) : undefined,
    agentCount: calculatedAgentCount,
    marketCount: calculatedMarketCount,
    members: uniqueMemberIds,
  };

  console.log('Parsed update data:', parsed);

  const validation = UpdateMissionFormSchema.safeParse(parsed);

  if (!validation.success) {
    console.log('Validation errors:', validation.error.flatten().fieldErrors);
    return {
      errors: validation.error.flatten().fieldErrors,
      success: false,
      data: parsed,
    };
  }

  const data = validation.data as UpdateMissionForm;

  try {
    // Check if mission exists and belongs to organization
    const existing = await prisma.mission.findFirst({
      where: {
        id: data.id,
        organizationId
      },
      include: {
        missionProjects: {
          include: {
            files: true,
          }
        },
        members: true,
      }
    });

    if (!existing) {
      return {
        errors: { _form: ['Mission introuvable'] },
        success: false,
        data: parsed,
      };
    }

    // Prepare update data
    const updateData: any = {};
    if (data.startDate !== undefined) updateData.startDate = data.startDate;
    if (data.endDate !== undefined) updateData.endDate = data.endDate;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.agentCount !== undefined) updateData.agentCount = data.agentCount;
    if (data.marketCount !== undefined) updateData.marketCount = data.marketCount;

    // Update members if provided
    if (parsed.members !== undefined) {
      updateData.members = {
        set: parsed.members.map(memberId => ({ id: memberId }))
      };
    }

    // Update the mission
    const mission = await prisma.mission.update({
      where: { id: data.id },
      data: updateData,
      include: {
        teamLeader: true,
        members: true,
      },
    });

    // Handle mission projects updates
    if (projectsData.length > 0) {
      // Delete existing mission projects and files
      await prisma.missionFile.deleteMany({
        where: {
          missionProject: {
            missionId: mission.id
          }
        }
      });

      await prisma.missionProject.deleteMany({
        where: { missionId: mission.id }
      });

      // Create new mission projects
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
    console.error('Error updating mission:', error);
    return {
      errors: { _form: ['Une erreur est survenue lors de la mise à jour de la mission'] },
      success: false,
      data: parsed,
    };
  }
}

export async function updateMissionWithRedirectAction(formData: FormData): Promise<void> {
  const res = await updateMissionAction({}, formData);
  if (res.success) redirect('/dashboard/missions');
}
