"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { getAuthErrorMessage } from "@/lib/errors/get-auth-error-message";
import prisma from "@/lib/prisma";

const adminSignUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: z.string().optional(),
  role: z.enum(["u4", "u5"], {
    message: "Only admin roles (u4, u5) are allowed"
  }),
});

export type AdminSignUpFormState = {
  success?: boolean;
  error?: string;
  fieldErrors?: {
    email?: string[];
    password?: string[];
    name?: string[];
    phoneNumber?: string[];
    role?: string[];
  };
  redirect?: string;
};

export const adminSignUpAction = async (
  prevState: AdminSignUpFormState,
  formData: FormData
): Promise<AdminSignUpFormState> => {
  try {
    const rawData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      name: formData.get("name") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      role: formData.get("role") as string,
    };

    const validatedData = adminSignUpSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        error: "Please check your input and try again",
        fieldErrors: validatedData.error.flatten().fieldErrors,
      };
    }

    const { email, password, name, phoneNumber, role } = validatedData.data;

    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
        callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      },
    });

    if (phoneNumber && result.user.id) {
      await prisma.user.update({
        where: { id: result.user.id },
        data: { phoneNumber },
      });
    }

    if (result.user.id) {
      await prisma.user.update({
        where: { id: result.user.id },
        data: { role },
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
      redirect: "/dashboard",
    };
  } catch (error) {
    console.error("Admin sign up error:", error);
    const errorMessage = getAuthErrorMessage(error, 'signup');
    return {
      error: errorMessage,
    };
  }
};

