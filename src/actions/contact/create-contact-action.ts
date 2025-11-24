"use server";

import prisma from "@/lib/prisma";
import { CreateContact, CreateContactSchema } from "@/models/contact-schema";
import { revalidatePath } from "next/cache";
import { requireOrganization } from "@/lib/auth-guard";

export type CreateContactState = {
    errors?: Record<string, string[]>;
    success?: boolean;
    data?: CreateContact | Record<string, unknown>;
};

/**
 * Server action to create a new contact
 */
export async function createContactAction(
    prevState: CreateContactState,
    formData: FormData
): Promise<CreateContactState> {
    console.log('createContactAction called with formData:');
    for (const [key, value] of formData.entries()) {
        console.log(`  ${key}: ${value}`);
    }

    const raw = {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
    };

    console.log('Raw form data received:', raw);

    // Convert to proper types (FormData.get() returns string | null)
    const parsed = {
        firstName: raw.firstName ? String(raw.firstName) : "",
        lastName: raw.lastName ? String(raw.lastName) : "",
        email: raw.email ? String(raw.email) : "",
    };

    console.log('Parsed data:', parsed);

    const validation = CreateContactSchema.safeParse(parsed);

    if (!validation.success) {
        console.log('Validation errors:', validation.error.flatten().fieldErrors);
        return {
            errors: validation.error.flatten().fieldErrors,
            success: false,
            data: parsed,
        };
    }

    const data = validation.data as CreateContact;

    try {
        const { organizationId } = await requireOrganization();

        // Check if contact with same email already exists in this organization
        const existingContact = await prisma.contact.findFirst({
            where: {
                email: data.email,
                organizationId
            },
        });

        if (existingContact) {
            return {
                errors: {
                    email: ["Un contact avec cette adresse email existe déjà"],
                },
                success: false,
                data,
            };
        }

        const contact = await prisma.contact.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                organization: { connect: { id: organizationId } },
            },
        });

        // Revalidate contacts pages
        revalidatePath("/dashboard/missions");
        revalidatePath("/dashboard/missions/new");

        return {
            success: true,
            data: contact,
        };
    } catch (error) {
        console.error("Error creating contact:", error);
        return {
            errors: { _form: ["Une erreur est survenue lors de la création du contact"] },
            success: false,
            data,
        };
    }
}
