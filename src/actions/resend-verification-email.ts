"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { getAuthErrorMessage } from "@/lib/errors/get-auth-error-message";

const resendVerificationEmailSchema = z.object({
  email: z.string().email("Adresse email invalide"),
});

export type ResendVerificationEmailFormState = {
  success?: boolean;
  error?: string;
  message?: string;
};

export const resendVerificationEmailAction = async (
  prevState: ResendVerificationEmailFormState,
  formData: FormData
): Promise<ResendVerificationEmailFormState> => {
  try {
    const rawData = {
      email: formData.get("email") as string,
    };

    const validatedData = resendVerificationEmailSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        error: "Veuillez vérifier votre adresse email",
      };
    }

    const { email } = validatedData.data;

    await auth.api.sendVerificationEmail({
      body: {
        email,
        callbackURL: "/",
      },
    });

    return {
      success: true,
      message: "Un nouvel email de vérification a été envoyé à votre adresse email.",
    };
  } catch (error) {
    console.error("Resend verification email error:", error);
    const errorMessage = getAuthErrorMessage(error, 'email-verification');
    return {
      error: errorMessage,
    };
  }
};