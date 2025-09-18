"use server";

import { ProjectNature, ProjectStatus } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { CreateProject, CreateProjectSchema } from "@/models/project-schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type CreateProjectState = {
    errors?: Record<string, string[]>;
    success?: boolean;
    data?: CreateProject | Record<string, unknown>;
};

/**
 * Server action to create a new project
 */
export async function createProjectAction(
    prevState: CreateProjectState,
    formData: FormData
): Promise<CreateProjectState> {
    const raw = {
        title: formData.get("title"),
        startDate: formData.get("startDate"),
        endDate: formData.get("endDate"),
        companyId: formData.get("companyId"),
        description: formData.get("description"),
        nature: formData.get("nature"),
        status: formData.get("status"),
    };

    const parsed = {
        ...raw,
        startDate: raw.startDate ? new Date(raw.startDate as string) : undefined,
        endDate: raw.endDate ? new Date(raw.endDate as string) : undefined,
        companyId: raw.companyId ? String(raw.companyId) : undefined,
    };

    const validation = CreateProjectSchema.safeParse(parsed);

    if (!validation.success) {
        return {
            errors: validation.error.flatten().fieldErrors,
            success: false,
            data: parsed,
        };
    }

    const data = validation.data as CreateProject;

    try {
        const project = await prisma.project.create({
            data: {
                title: data.title,
                description: data.description,
                startDate: data.startDate,
                endDate: data.endDate,
                companyId: data.companyId,
                nature: data.nature as unknown as ProjectNature,
                status: data.status as unknown as ProjectStatus,
            },
        });

        // Revalidate projects listing
        revalidatePath("/dashboard/projects");

        return {
            success: true,
            data: project,
        };
    } catch (error) {
        console.error("Error creating market:", error);
        return {
            errors: { _form: ["Une erreur est survenue lors de la création du marché"] },
            success: false,
            data,
        };
    }
}

export async function createProjectWithRedirectAction(formData: FormData): Promise<void> {
    const result = await createProjectAction({}, formData);
    if (result.success) redirect('/dashboard/projects');
}
