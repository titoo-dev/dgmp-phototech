"use server";

import { auth } from "@/lib/auth";
import { updateOrganizationSchema } from "@/models/organization-schema";
import { getSessionAction } from "@/actions/get-session";
import { headers } from "next/headers";

export type FormState = {
  success: boolean;
  message?: string;
  fieldErrors?: {
    id?: string[];
    name?: string[];
    slug?: string[];
    logo?: string[];
  };
};

export const updateOrganization = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState> => {
  try {
    const { session, user } = await getSessionAction();

    if (!session || !user) {
      return {
        success: false,
        message: "Vous devez être connecté pour modifier une organisation",
      };
    }

    if (user.role !== "u5") {
      return {
        success: false,
        message: "Vous n'avez pas les permissions nécessaires pour modifier une organisation",
      };
    }

    const id = formData.get("id");
    const name = formData.get("name");
    const slug = formData.get("slug");
    const logo = formData.get("logo");

    const validatedFields = updateOrganizationSchema.safeParse({
      id,
      name: name || undefined,
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

    const updateData: {
      name?: string;
      slug?: string;
      logo?: string;
    } = {};

    if (data.name) {
      updateData.name = data.name;
    }

    if (data.slug) {
      updateData.slug = data.slug;
    }

    if (data.logo !== undefined) {
      updateData.logo = data.logo || undefined;
    }

    const organization = await auth.api.updateOrganization({
      body: {
        organizationId: data.id,
        data: updateData,
      },
      headers: await headers(),
    });

    if (!organization) {
      return {
        success: false,
        message: "Échec de la modification de l'organisation",
      };
    }

    return {
      success: true,
      message: `Organisation "${organization.name}" modifiée avec succès`,
    };
  } catch (error: any) {
    console.error("Error updating organization:", error);

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
      message: error?.message || "Une erreur est survenue lors de la modification de l'organisation",
    };
  }
};
