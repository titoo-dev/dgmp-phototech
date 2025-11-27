"use server";

import prisma from "@/lib/prisma";
import { getSessionAction } from "@/actions/get-session";
import { z } from "zod";
import { sendInvitationEmail } from "@/lib/email/send-email";

const inviteMemberSchema = z.object({
  email: z.string().email("Email invalide"),
  organizationId: z.string().min(1, "ID de l'organisation requis"),
  role: z.enum(["u1", "u2", "u3", "u4", "u5"], {
    message: "Rôle invalide. Choisissez parmi: u1, u2, u3, u4, u5"
  }),
});

export type InviteMemberFormState = {
  success: boolean;
  message?: string;
  fieldErrors?: {
    email?: string[];
    organizationId?: string[];
    role?: string[];
  };
};

export const inviteMember = async (
  prevState: InviteMemberFormState,
  formData: FormData
): Promise<InviteMemberFormState> => {
  try {
    const { session, user } = await getSessionAction();

    if (!session || !user) {
      return {
        success: false,
        message: "Vous devez être connecté pour inviter un membre",
      };
    }

    if (user.role !== "u5") {
      return {
        success: false,
        message: "Vous n'avez pas les permissions nécessaires pour inviter un membre",
      };
    }

    const email = formData.get("email");
    const organizationId = formData.get("organizationId");
    const role = formData.get("role");

    const validatedFields = inviteMemberSchema.safeParse({
      email,
      organizationId,
      role,
    });

    if (!validatedFields.success) {
      return {
        success: false,
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const data = validatedFields.data;

    const organization = await prisma.organization.findUnique({
      where: { id: data.organizationId },
    });

    if (!organization) {
      return {
        success: false,
        message: "Organisation introuvable",
      };
    }

    const existingMember = await prisma.member.findFirst({
      where: {
        organizationId: data.organizationId,
        user: {
          email: data.email,
        },
      },
    });

    if (existingMember) {
      return {
        success: false,
        message: "Cet utilisateur est déjà membre de l'organisation",
      };
    }

    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        organizationId: data.organizationId,
        email: data.email,
        status: "pending",
      },
    });

    if (existingInvitation) {
      return {
        success: false,
        message: "Une invitation en attente existe déjà pour cet utilisateur",
      };
    }

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    const invitationId = crypto.randomUUID();

    const invitation = await prisma.invitation.create({
      data: {
        id: invitationId,
        email: data.email,
        organizationId: data.organizationId,
        role: data.role,
        status: "pending",
        expiresAt,
        inviterId: user.id,
      },
    });

    const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/signup/${invitation.id}?email=${encodeURIComponent(data.email)}`;

    try {
      await sendInvitationEmail(
        data.email,
        invitationUrl,
        user.name,
        organization.name,
        data.role,
        organization.logo
      );
    } catch (emailError) {
      console.error("Failed to send invitation email:", emailError);
    }

    return {
      success: true,
      message: `Invitation envoyée à ${data.email} avec le rôle ${data.role}`,
    };
  } catch (error: any) {
    console.error("Error inviting member:", error);

    return {
      success: false,
      message: error?.message || "Une erreur est survenue lors de l'invitation du membre",
    };
  }
};

