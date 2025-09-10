"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { UpdateMissionFormSchema, type UpdateMissionForm } from "../../models/mission-schema";
import prisma from "@/lib/prisma";
import { MissionStatus } from "@/lib/generated/prisma";
import { put } from '@vercel/blob';

export type UpdateMissionState = {
  errors?: Record<string, string[]>;
  success?: boolean;
  data?: UpdateMissionForm | Record<string, unknown>;
};

async function uploadPhotoFile(file: File): Promise<{ url: string; metadata: any }> {
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

export async function updateMissionAction(
  prevState: UpdateMissionState,
  formData: FormData
): Promise<UpdateMissionState> {

  const raw = {
    id: formData.get("id"),
    missionNumber: formData.get("missionNumber"),
    teamLeaderId: formData.get("teamLeaderId"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    location: formData.get("location"),
    status: formData.get("status"),
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

  const parsed = {
    id: raw.id ? String(raw.id) : undefined,
    teamLeaderId: raw.teamLeaderId ? String(raw.teamLeaderId) : undefined,
    startDate: raw.startDate ? new Date(raw.startDate as string) : undefined,
    endDate: raw.endDate ? new Date(raw.endDate as string) : undefined,
    location: raw.location ? String(raw.location) : undefined,
    status: raw.status ? String(raw.status) : undefined,
    agentCount: raw.agentCount ? Number(raw.agentCount) : undefined,
    marketCount: raw.marketCount ? Number(raw.marketCount) : undefined,
    members: Array.isArray(raw.memberIds) ? raw.memberIds.map(id => String(id)) : [],
    missionNumber: raw.missionNumber ? String(raw.missionNumber) : undefined,
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
    // Check if mission exists
    const existing = await prisma.mission.findUnique({
      where: { id: data.id },
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

    // Check for duplicate mission number (if changed)
    if (data.missionNumber && data.missionNumber !== existing.missionNumber) {
      const conflict = await prisma.mission.findFirst({
        where: {
          missionNumber: data.missionNumber,
          id: { not: data.id },
        },
      });

      if (conflict) {
        return {
          errors: {
            _form: ['Une mission avec ce numéro existe déjà'],
          },
          success: false,
          data: parsed,
        };
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (data.missionNumber !== undefined) updateData.missionNumber = data.missionNumber;
    if (data.teamLeaderId !== undefined) updateData.teamLeader = { connect: { id: data.teamLeaderId } };
    if (data.startDate !== undefined) updateData.startDate = data.startDate;
    if (data.endDate !== undefined) updateData.endDate = data.endDate;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.agentCount !== undefined) updateData.agentCount = data.agentCount;
    if (data.marketCount !== undefined) updateData.marketCount = data.marketCount;
    if (data.status !== undefined) updateData.status = data.status as MissionStatus;

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
