"use server";

import { revalidatePath } from "next/cache";
import { CreateMissionSchema, type CreateMission } from "../../models/mission-schema";
import prisma from "@/lib/prisma";
import { MissionStatus } from "@/lib/generated/prisma";
import { put } from '@vercel/blob';

export type CreateMissionMobileState = {
  errors?: Record<string, string[]>;
  success?: boolean;
  data?: CreateMission | Record<string, unknown>;
};

export type MobileFileUpload = {
  base64Data: string;
  fileName: string;
  mimeType: string;
  size: number;
};

export type CreateMissionMobilePayload = {
  teamLeaderId: string;
  startDate: string;
  endDate: string;
  location: string;
  status?: string;
  memberIds: string[];
  projectsData: Array<{ 
    projectId: string; 
    notes: string; 
    marketName: string;
  }>;
  photoFiles?: { [marketName: string]: MobileFileUpload[] };
};

function generateMissionNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const stamp = now.getTime().toString().slice(-6);
  return `MIS-${year}-${stamp}`;
}

// Convert base64 to File-like object for compatibility with existing upload function
function base64ToFile(base64Data: string, fileName: string, mimeType: string): File {
  // Remove data URL prefix if present
  const base64 = base64Data.replace(/^data:[^;]+;base64,/, '');
  
  // Convert base64 to bytes
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  
  // Create File object
  const file = new File([byteArray], fileName, { type: mimeType });
  return file;
}

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

// Enhanced upload function for mobile base64 files
async function uploadMobilePhotoFile(mobileFile: MobileFileUpload): Promise<{ url: string; metadata: any }> {
  // Validate file type (images only)
  if (!mobileFile.mimeType.startsWith('image/')) {
    throw new Error('Only image files are allowed');
  }

  // Convert base64 to File object
  const file = base64ToFile(mobileFile.base64Data, mobileFile.fileName, mobileFile.mimeType);
  
  // Use existing upload logic
  return uploadPhotoFile(file);
}

export async function createMissionMobileAction(
  payload: CreateMissionMobilePayload
): Promise<CreateMissionMobileState> {

  console.log('Mobile payload:', payload);

  // If missionNumber not provided, generate one
  const missionNumber = generateMissionNumber();

  // Remove duplicates from memberIds
  const uniqueMemberIds = [...new Set(payload.memberIds.map(id => String(id)))];

  // Auto-calculate agentCount (members + 1 team leader)
  const agentCount = uniqueMemberIds.length + 1;

  // Auto-calculate marketCount from projectsData length
  const marketCount = payload.projectsData.length;

  const parsed = {
    teamLeaderId: payload.teamLeaderId,
    startDate: new Date(payload.startDate),
    endDate: new Date(payload.endDate),
    location: payload.location,
    status: payload.status || 'DRAFT',
    agentCount: agentCount,
    marketCount: marketCount,
    members: uniqueMemberIds,
  };

  console.log('Parsed mobile data:', parsed);

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
        members: data.members && data.members.length > 0 ? {
          connect: data.members.map(memberId => ({ id: memberId }))
        } : undefined,
        startDate: data.startDate,
        endDate: data.endDate,
        location: data.location,
        status: statusValue,
        agentCount: data.agentCount,
        marketCount: data.marketCount,
      },
      include: {
        teamLeader: true,
        members: true,
      },
    });

    // Create MissionProject entries and upload photos
    if (payload.projectsData.length > 0) {
      const missionProjects = await Promise.all(
        payload.projectsData.map(projectData =>
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
      if (payload.photoFiles) {
        for (const projectData of payload.projectsData) {
          const missionProject = missionProjects.find(mp => mp.projectId === projectData.projectId);
          if (!missionProject) continue;

          const marketPhotos = payload.photoFiles[projectData.marketName] || [];
          
          for (const mobilePhotoFile of marketPhotos) {
            try {
              const uploadResult = await uploadMobilePhotoFile(mobilePhotoFile);
              
              await prisma.missionFile.create({
                data: {
                  fileUrl: uploadResult.url,
                  metadata: JSON.stringify(uploadResult.metadata),
                  missionProjectId: missionProject.id,
                },
              });
            } catch (error) {
              console.error('Failed to upload mobile photo:', error);
              // Continue with other photos even if one fails
            }
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
    console.error('Error creating mission from mobile:', error);
    return {
      errors: { _form: ['Une erreur est survenue lors de la création de la mission'] },
      success: false,
      data: parsed,
    };
  }
}

// Hybrid action that can handle both FormData (web) and JSON (mobile)
export async function createMissionHybridAction(
  prevState: CreateMissionMobileState,
  input: FormData | CreateMissionMobilePayload
): Promise<CreateMissionMobileState> {
  
  // Check if input is FormData (web client) or JSON payload (mobile client)
  if (input instanceof FormData) {
    // Handle web FormData - use existing logic
    const raw = {
      teamLeaderId: input.get("teamLeaderId"),
      startDate: input.get("startDate"),
      endDate: input.get("endDate"),
      location: input.get("location"),
      status: input.get("status"),
      memberIds: input.getAll("memberIds"),
      projectsData: input.get("projectsData"),
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

    // Extract photo files from FormData
    const photoFiles: { [marketName: string]: File[] } = {};
    for (const [key, value] of input.entries()) {
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

    // Convert to mobile format for unified processing
    const mobilePayload: CreateMissionMobilePayload = {
      teamLeaderId: raw.teamLeaderId ? String(raw.teamLeaderId) : '',
      startDate: raw.startDate ? String(raw.startDate) : '',
      endDate: raw.endDate ? String(raw.endDate) : '',
      location: raw.location ? String(raw.location) : '',
      status: raw.status ? String(raw.status) : 'DRAFT',
      memberIds: Array.isArray(raw.memberIds) 
        ? raw.memberIds.map(id => String(id))
        : [],
      projectsData: projectsData,
      // Note: For FormData, we'll handle files differently in the upload process
    };

    return createMissionMobileAction(mobilePayload);
  } else {
    // Handle mobile JSON payload
    return createMissionMobileAction(input);
  }
}
