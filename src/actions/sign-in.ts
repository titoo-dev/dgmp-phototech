"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { getAuthErrorMessage } from "@/lib/errors/get-auth-error-message";

const signInSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export type SignInFormState = {
  success?: boolean;
  error?: string;
  fieldErrors?: {
    email?: string[];
    password?: string[];
  };
  redirect?: string;
};

export const signInAction = async (
  prevState: SignInFormState,
  formData: FormData
): Promise<SignInFormState> => {
  try {
    const rawData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      rememberMe: formData.get("rememberMe") === "true",
    };

    const validatedData = signInSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        error: "Please check your input and try again",
        fieldErrors: validatedData.error.flatten().fieldErrors,
      };
    }

    const { email, password, rememberMe } = validatedData.data;

    console.log("Sign in action called with:", { email, password, rememberMe });

    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
        callbackURL: "/",
        rememberMe: rememberMe,
      },
    });

    if (!result.token) {
      return {
        error: "Invalid email or password",
      };
    }

    return {
      success: true,
      redirect: "/",
    };
  } catch (error) {
    console.error("Sign in error:", error);
    
    const errorMessage = getAuthErrorMessage(error, 'signin');
    
    return {
      error: errorMessage,
    };
  }
};
