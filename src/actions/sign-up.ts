"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { getAuthErrorMessage } from "@/lib/errors/get-auth-error-message";
import prisma from "@/lib/prisma";

const signUpSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  phoneNumber: z.string().optional(),
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
    };

    const validatedData = signUpSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        error: "Please check your input and try again",
        fieldErrors: validatedData.error.flatten().fieldErrors,
      };
    }

    const { email, password, name, phoneNumber } = validatedData.data;

    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: name || "unknown",
        callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/auth/signin`,
      },
    });

    // Update user with phone number if provided
    if (phoneNumber && result.user.id) {
      await prisma.user.update({
        where: { id: result.user.id },
        data: { phoneNumber },
      });
    }

    if (!result.user.emailVerified) {
      return {
        success: false,
        error: "Please verify your email address",
        redirect: "/auth/verify-email",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Sign up error:", error);
    const errorMessage = getAuthErrorMessage(error, 'signup');
    return {
      error: errorMessage,
    };
  }
};
