"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { CreateCompanySchema, type CreateCompany } from "@/models/company-schema";
import { redirect } from "next/navigation";
import { requireOrganization } from "@/lib/auth-guard";

export type CreateCompanyState = {
    errors?: {
        name?: string[];
        email?: string[];
        phoneNumber?: string[];
        nif?: string[];
        employeeCount?: string[];
        _form?: string[];
    };
    success?: boolean;
    data?: CreateCompany;
};

export async function createCompanyAction(
    prevState: CreateCompanyState,
    formData: FormData
): Promise<CreateCompanyState> {
    // Extract and transform form data
    const rawData = {
        name: formData.get("name"),
        email: formData.get("email"),
        phoneNumber: formData.get("phoneNumber"),
        nif: formData.get("nif"),
        employeeCount: formData.get("employeeCount"),
    };

    // Validate the form data
    const validationResult = CreateCompanySchema.safeParse({
        ...rawData,
        employeeCount: rawData.employeeCount ? Number(rawData.employeeCount) : undefined,
    });

    if (!validationResult.success) {
        return {
            errors: validationResult.error.flatten().fieldErrors,
            success: false,
            data: {
                name: rawData.name as string,
                email: rawData.email as string,
                phoneNumber: rawData.phoneNumber as string,
                nif: rawData.nif as string,
                employeeCount: rawData.employeeCount ? Number(rawData.employeeCount) : 0,
            },
        };
    }

    const validatedData = validationResult.data;

    try {
        const { organizationId } = await requireOrganization();

        // Check if company with same email or NIF already exists in this organization
        const existingCompany = await prisma.company.findFirst({
            where: {
                organizationId,
                OR: [
                    { email: validatedData.email },
                    { nif: validatedData.nif },
                ],
            },
        });

        if (existingCompany) {
            if (existingCompany.email === validatedData.email) {
                return {
                    errors: {
                        email: ["Une entreprise avec cette adresse email existe déjà"],
                    },
                    success: false,
                    data: validatedData,
                };
            }

            if (existingCompany.nif === validatedData.nif) {
                return {
                    errors: {
                        nif: ["Une entreprise avec ce NIF existe déjà"],
                    },
                    success: false,
                    data: validatedData,
                };
            }
        }

        // Create the company
        const company = await prisma.company.create({
            data: {
                ...validatedData,
                organization: { connect: { id: organizationId } },
            },
        });

        // Revalidate the companies page to show the new company
        revalidatePath("/dashboard/companies");
        revalidatePath("/(client)/dashboard/companies", "page");

        return {
            success: true,
            data: company,
        };
    } catch (error) {
        console.error("Error creating company:", error);

        return {
            errors: {
                _form: ["Une erreur est survenue lors de la création de l'entreprise"],
            },
            success: false,
            data: validatedData,
        };
    }
}

export async function createCompanyWithRedirectAction(formData: FormData): Promise<void> {
    const result = await createCompanyAction({}, formData);

    if (result.success) {
        redirect("/dashboard/companies");
    }

    // If there are errors, the form component should handle them
    // by using useActionState with createCompanyAction instead
}