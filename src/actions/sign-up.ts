"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";

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
        error: "Invalid form data",
        fieldErrors: validatedData.error.flatten().fieldErrors,
      };
    }

    const { email, password, name } = validatedData.data;

    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: name || "unknown",
        callbackURL: "/",
      },
    });

    if (!result.token) {
      return {
        error: "Failed to create account",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Sign up error:", error);
    return {
      error: "An unexpected error occurred. Please try again.",
    };
  } finally {
    redirect("/");
  }
};
