"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { getAuthErrorMessage } from "@/lib/errors/get-auth-error-message";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email/send-email";


const createUserSchema = z.object({
  email: z.email("Adresse email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  confirmPassword: z.string(),
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phoneNumber: z.string().optional(),
  role: z.enum(["u1", "u2", "u3"]).optional().default("u1"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export type CreateUserFormState = {
  success?: boolean;
  error?: string;
  fieldErrors?: {
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    name?: string[];
    phoneNumber?: string[];
    role?: string[];
  };
  user?: {
    id: string;
    email: string;
    name: string;
  };
};

export const createUserAction = async (
  prevState: CreateUserFormState,
  formData: FormData
): Promise<CreateUserFormState> => {
  try {
    const rawData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
      name: formData.get("name") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      role: formData.get("role") as string,
    };

    const validatedData = createUserSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        error: "Please check your input and try again",
        fieldErrors: validatedData.error.flatten().fieldErrors,
      };
    }

    const { email, password, name, phoneNumber, role } = validatedData.data;

    const newUser = await auth.api.signUpEmail({
        body: {
          email,
          password,
          name: name || "unknown",
          callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/auth/signin`,
          role: role,
        },
    });

    // Update user with phone number if provided
    if (phoneNumber && newUser.user.id) {
      await prisma.user.update({
        where: { id: newUser.user.id },
        data: { phoneNumber },
      });
    }

    const data = await auth.api.setRole({
        body: {
            userId: newUser.user.id,
            role: role,
        },
        headers: await headers(),
    });

    if (!data) {
      return {
        error: "Failed to set user role",
      };
    }

    try {
      await sendWelcomeEmail(email, name);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
    }

    return {
      success: true,
      user: {
        id: newUser.user.id,
        email: newUser.user.email,
        name: newUser.user.name,
      },
    };
  } catch (error) {
    console.error("Create user error:", error);
    const errorMessage = getAuthErrorMessage(error, 'signup');
    return {
      error: errorMessage,
    };
  }
};
