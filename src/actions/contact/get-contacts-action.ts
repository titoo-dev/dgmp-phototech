"use server";

import prisma from "@/lib/prisma";
import type { ContactModel } from "@/models/contact-schema";
import { requireOrganization } from "@/lib/auth-guard";

export type GetContactsState = {
    contacts: ContactModel[];
    error?: string;
};

/**
 * Server action to fetch all contacts
 * @returns GetContactsState with contacts data or error
 */
export async function getContactsAction(): Promise<GetContactsState> {
    try {
        const { organizationId } = await requireOrganization();

        const contacts = await prisma.contact.findMany({
            where: {
                organizationId,
            },
            orderBy: [
                { firstName: 'asc' },
                { lastName: 'asc' }
            ],
        });

        const contactModels: ContactModel[] = contacts.map((contact) => ({
            id: contact.id,
            firstName: contact.firstName,
            lastName: contact.lastName,
            email: contact.email,
        }));

        return {
            contacts: contactModels,
        };
    } catch (error) {
        console.error("Error fetching contacts:", error);

        return {
            contacts: [],
            error: "Une erreur est survenue lors du chargement des contacts",
        };
    }
}
