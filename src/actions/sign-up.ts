"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { getAuthErrorMessage } from "@/lib/errors/get-auth-error-message";
import prisma from "@/lib/prisma";

const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  phoneNumber: z.string().optional(),
  invitationId: z.string().optional(),
});

export type SignUpFormState = {
  success?: boolean;
  error?: string;
  fieldErrors?: {
    email?: string[];
    password?: string[];
    name?: string[];
    phoneNumber?: string[];
  };
  redirect?: string;
};

export const signUpAction = async (
  prevState: SignUpFormState,
  formData: FormData
): Promise<SignUpFormState> => {
  try {
    const rawData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      name: formData.get("name") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      invitationId: formData.get("invitationId") as string,
    };

    const validatedData = signUpSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        error: "Please check your input and try again",
        fieldErrors: validatedData.error.flatten().fieldErrors,
      };
    }

    const { email, password, name, phoneNumber, invitationId } = validatedData.data;

    let invitationRole: string | null = null;

    if (invitationId) {
      const invitation = await prisma.invitation.findUnique({
        where: { id: invitationId },
      });

      if (!invitation) {
        return {
          error: "Invitation introuvable",
        };
      }

      if (invitation.status !== "pending") {
        return {
          error: "Cette invitation n'est plus valide",
        };
      }

      if (new Date(invitation.expiresAt) < new Date()) {
        return {
          error: "Cette invitation a expiré",
        };
      }

      if (invitation.email !== email) {
        return {
          error: "L'email ne correspond pas à l'invitation",
        };
      }

      invitationRole = invitation.role;
    }

    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: name || "unknown",
        callbackURL: `/auth/signin`,
      },
    });

    if (phoneNumber && result.user.id) {
      await prisma.user.update({
        where: { id: result.user.id },
        data: { phoneNumber },
      });
    }

    if (invitationRole && result.user.id) {
      await prisma.user.update({
        where: { id: result.user.id },
        data: { role: invitationRole },
      });
    }

    if (invitationId && result.user.id) {
      const invitation = await prisma.invitation.findUnique({
        where: { id: invitationId },
      });

      if (invitation && invitation.status === "pending") {
        await prisma.invitation.update({
          where: { id: invitationId },
          data: { status: "accepted" },
        });

        await prisma.member.create({
          data: {
            userId: result.user.id,
            organizationId: invitation.organizationId,
            role: invitation.role || "u1",
            createdAt: new Date(),
          },
        });
      }
    }

    return {
      success: true,
      redirect: "/dashboard",
    };
  } catch (error) {
    console.error("Sign up error:", error);
    const errorMessage = getAuthErrorMessage(error, 'signup');
    return {
      error: errorMessage,
    };
  }
};
