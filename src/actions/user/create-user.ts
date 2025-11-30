"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { getSessionAction } from "@/actions/get-session";
import { revalidatePath } from "next/cache";

const inviteUserSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  role: z.enum(["u1", "u2", "u3", "u4"], {
    message: "Rôle invalide. Choisissez parmi: u1, u2, u3, u4"
  }),
});

export type CreateUserFormState = {
  success?: boolean;
  error?: string;
  message?: string;
  fieldErrors?: {
    email?: string[];
    role?: string[];
  };
};

export const createUserAction = async (
  prevState: CreateUserFormState,
  formData: FormData
): Promise<CreateUserFormState> => {
  try {
    const { session, user } = await getSessionAction();

    if (!session || !user) {
      return {
        success: false,
        error: "Vous devez être connecté pour inviter un utilisateur",
      };
    }

    if (user.role !== "u4") {
      return {
        success: false,
        error: "Vous n'avez pas les permissions nécessaires pour inviter un utilisateur",
      };
    }

    const organizationId = session.activeOrganizationId;

    if (!organizationId) {
      return {
        success: false,
        error: "Aucune organisation active",
      };
    }

    const rawData = {
      email: formData.get("email") as string,
      role: formData.get("role") as string,
    };

    const validatedData = inviteUserSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        error: "Veuillez vérifier les champs du formulaire",
        fieldErrors: validatedData.error.flatten().fieldErrors,
      };
    }

    const { email, role } = validatedData.data;

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      return {
        success: false,
        error: "Organisation introuvable",
      };
    }

    const existingMember = await prisma.member.findFirst({
      where: {
        organizationId: organizationId,
        user: {
          email: email,
        },
      },
    });

    if (existingMember) {
      return {
        success: false,
        error: "Cet utilisateur est déjà membre de l'organisation",
      };
    }

    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        organizationId: organizationId,
        email: email,
        status: "pending",
      },
    });

    if (existingInvitation) {
      return {
        success: false,
        error: "Une invitation en attente existe déjà pour cet utilisateur",
      };
    }

    const invitation = await auth.api.createInvitation({
      body: {
        email: email,
        role: role,
        organizationId: organizationId,
        resend: true,
      },
      headers: await headers(),
    });

    revalidatePath("/dashboard/users");

    return {
      success: true,
      message: `Invitation envoyée à ${invitation.email} pour rejoindre ${organization.name} avec le rôle ${invitation.role}`,
    };
  } catch (error: any) {
    console.error("Error inviting user:", error);
    return {
      success: false,
      error: error?.message || "Une erreur est survenue lors de l'invitation de l'utilisateur",
    };
  }
};
