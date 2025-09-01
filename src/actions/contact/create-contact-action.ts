"use server";

import prisma from "@/lib/prisma";
import { CreateContact, CreateContactSchema } from "@/models/contact-schema";
import { revalidatePath } from "next/cache";

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
    const raw = {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
    };

    const validation = CreateContactSchema.safeParse(raw);

    if (!validation.success) {
        return {
            errors: validation.error.flatten().fieldErrors,
            success: false,
            data: raw,
        };
    }

    const data = validation.data as CreateContact;

    try {
        // Check if contact with same email already exists
        const existingContact = await prisma.contact.findFirst({
            where: { email: data.email },
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
            },
        });

        // Revalidate contacts pages
        revalidatePath("/dashboard/missions");

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
