"use server";

import { createOrganizationSchema } from "@/models/organization-schema";
import { getSessionAction } from "@/actions/get-session";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export type FormState = {
  success: boolean;
  message?: string;
  fieldErrors?: {
    name?: string[];
    slug?: string[];
    logo?: string[];
  };
};

export const createOrganization = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState> => {
  try {
    const { session, user } = await getSessionAction();

    if (!session || !user) {
      return {
        success: false,
        message: "Vous devez être connecté pour créer une organisation",
      };
    }

    if (user.role !== "u5") {
      return {
        success: false,
        message: "Vous n'avez pas les permissions nécessaires pour créer une organisation",
      };
    }

    const name = formData.get("name");
    const slug = formData.get("slug");
    const logo = formData.get("logo");

    const validatedFields = createOrganizationSchema.safeParse({
      name,
      slug: slug || undefined,
      logo: logo || undefined,
    });

    if (!validatedFields.success) {
      return {
        success: false,
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const data = validatedFields.data;

    const organizationSlug =
      data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const bodyData: {
      name: string;
      slug: string;
      logo?: string;
    } = {
      name: data.name,
      slug: organizationSlug,
    };

    if (data.logo) {
      bodyData.logo = data.logo;
    }

    const organization = await auth.api.createOrganization({
      body: bodyData,
      headers: await headers(),
    });

    if (!organization) {
      return {
        success: false,
        message: "Échec de la création de l'organisation",
      };
    }

    return {
      success: true,
      message: `Organisation "${organization.name}" créée avec succès`,
    };
  } catch (error: any) {
    console.error("Error creating organization:", error);
    
    if (error?.message?.includes("slug")) {
      return {
        success: false,
        fieldErrors: {
          slug: ["Ce slug est déjà utilisé par une autre organisation"],
        },
      };
    }

    return {
      success: false,
      message: error?.message || "Une erreur est survenue lors de la création de l'organisation",
    };
  }
};
