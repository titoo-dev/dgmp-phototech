"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { getAuthErrorMessage } from "@/lib/errors/get-auth-error-message";

const signUpSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
});

export type SignUpFormState = {
  success?: boolean;
  error?: string;
  fieldErrors?: {
    email?: string[];
    password?: string[];
    name?: string[];
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
    };

    const validatedData = signUpSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        error: "Please check your input and try again",
        fieldErrors: validatedData.error.flatten().fieldErrors,
      };
    }

    const { email, password, name } = validatedData.data;

    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: name || "unknown",
        callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/auth/signin`,
      },
    });

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
