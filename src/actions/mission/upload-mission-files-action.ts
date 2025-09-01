"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

export type UploadMissionFilesState = {
  errors?: Record<string, string[]>;
  success?: boolean;
  data?: any;
};

export async function uploadMissionFilesAction(
  missionProjectId: string,
  files: File[]
): Promise<UploadMissionFilesState> {
  if (!missionProjectId || !files || files.length === 0) {
    return {
      errors: { _form: ['Mission project ID et fichiers requis'] },
      success: false,
    };
  }

  try {
    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'missions');
    await mkdir(uploadDir, { recursive: true });

    const uploadedFiles = [];

    for (const file of files) {
      // Generate unique filename
      const extension = file.name.split('.').pop();
      const filename = `${randomUUID()}.${extension}`;
      const filepath = join(uploadDir, filename);
      const publicUrl = `/uploads/missions/${filename}`;

      // Convert file to buffer and save
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filepath, buffer);

      // Create MissionFile record
      const missionFile = await prisma.missionFile.create({
        data: {
          fileUrl: publicUrl,
          metadata: JSON.stringify({
            originalName: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString(),
          }),
          missionProjectId,
        },
      });

      uploadedFiles.push(missionFile);
    }

    revalidatePath('/dashboard/missions');

    return {
      success: true,
      data: uploadedFiles,
    };
  } catch (error) {
    console.error('Error uploading mission files:', error);
    return {
      errors: { _form: ['Erreur lors du téléchargement des fichiers'] },
      success: false,
    };
  }
}

export async function deleteMissionFileAction(
  fileId: string
): Promise<UploadMissionFilesState> {
  if (!fileId) {
    return {
      errors: { _form: ['ID du fichier requis'] },
      success: false,
    };
  }

  try {
    const file = await prisma.missionFile.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return {
        errors: { _form: ['Fichier introuvable'] },
        success: false,
      };
    }

    // Delete from database
    await prisma.missionFile.delete({
      where: { id: fileId },
    });

    // TODO: Delete physical file from filesystem
    // Note: You might want to implement this based on your file storage strategy

    revalidatePath('/dashboard/missions');

    return {
      success: true,
      data: { deletedFileId: fileId },
    };
  } catch (error) {
    console.error('Error deleting mission file:', error);
    return {
      errors: { _form: ['Erreur lors de la suppression du fichier'] },
      success: false,
    };
  }
}
