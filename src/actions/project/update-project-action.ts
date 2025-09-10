"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { UpdateProjectFormSchema, type UpdateProjectForm } from "../../models/project-schema";
import prisma from "@/lib/prisma";
import { ProjectStatus, ProjectNature } from "@/lib/generated/prisma";

export type UpdateProjectState = {
  errors?: Record<string, string[]>;
  success?: boolean;
  data?: UpdateProjectForm | Record<string, unknown>;
};

export async function updateProjectAction(
  prevState: UpdateProjectState,
  formData: FormData
): Promise<UpdateProjectState> {

  const raw = {
    id: formData.get("id"),
    title: formData.get("title"),
    description: formData.get("description"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    status: formData.get("status"),
    nature: formData.get("nature"),
    companyId: formData.get("companyId"),
  };

  const parsed = {
    id: raw.id ? String(raw.id) : undefined,
    title: raw.title ? String(raw.title) : undefined,
    description: raw.description ? String(raw.description) : undefined,
    startDate: raw.startDate ? new Date(raw.startDate as string) : undefined,
    endDate: raw.endDate ? new Date(raw.endDate as string) : undefined,
    status: raw.status ? String(raw.status) : undefined,
    nature: raw.nature ? String(raw.nature) : undefined,
    companyId: raw.companyId ? String(raw.companyId) : undefined,
  };

  console.log('Parsed update project data:', parsed);

  const validation = UpdateProjectFormSchema.safeParse(parsed);

  if (!validation.success) {
    console.log('Validation errors:', validation.error.flatten().fieldErrors);
    return {
      errors: validation.error.flatten().fieldErrors,
      success: false,
      data: parsed,
    };
  }

  const data = validation.data as UpdateProjectForm;

  try {
    // Check if project exists
    const existing = await prisma.project.findUnique({
      where: { id: data.id },
      include: {
        company: true,
        missionProjects: {
          include: {
            mission: true,
          }
        },
      }
    });

    if (!existing) {
      return {
        errors: { _form: ['Projet introuvable'] },
        success: false,
        data: parsed,
      };
    }

    // Prepare update data
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.startDate !== undefined) updateData.startDate = data.startDate;
    if (data.endDate !== undefined) updateData.endDate = data.endDate;
    if (data.status !== undefined) updateData.status = data.status as ProjectStatus;
    if (data.nature !== undefined) updateData.nature = data.nature as ProjectNature;
    if (data.companyId !== undefined) updateData.company = { connect: { id: data.companyId } };

    // Update the project
    const project = await prisma.project.update({
      where: { id: data.id },
      data: updateData,
      include: {
        company: true,
        missionProjects: {
          include: {
            mission: {
              include: {
                teamLeader: true,
              },
            },
          },
        },
      },
    });

    revalidatePath('/dashboard/projects');
    revalidatePath('/dashboard/projects', 'page');

    return {
      success: true,
      data: project,
    };
  } catch (error) {
    console.error('Error updating project:', error);
    return {
      errors: { _form: ['Une erreur est survenue lors de la mise à jour du projet'] },
      success: false,
      data: parsed,
    };
  }
}

export async function updateProjectWithRedirectAction(formData: FormData): Promise<void> {
	const res = await updateProjectAction({}, formData);
	if (res.success) redirect('/dashboard/projects');
}