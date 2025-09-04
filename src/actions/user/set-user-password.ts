"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const setPasswordSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export type SetPasswordFormState = {
    success?: boolean;
    error?: string;
    fieldErrors?: {
        userId?: string[];
        newPassword?: string[];
    };
};

export const setUserPasswordAction = async (
    prevState: SetPasswordFormState,
    formData: FormData
): Promise<SetPasswordFormState> => {
    try {
        const rawData = {
            userId: formData.get("userId") as string,
            newPassword: formData.get("newPassword") as string,
        };

        const validatedData = setPasswordSchema.safeParse(rawData);

        if (!validatedData.success) {
            return {
                error: "Please check your input and try again",
                fieldErrors: validatedData.error.flatten().fieldErrors,
            };
        }

        const { userId, newPassword } = validatedData.data;

        const data = await auth.api.setUserPassword({
            body: {
                newPassword: newPassword,
                userId: userId,
            },
            headers: await headers(),
        });

        if (!data) {
            return {
                error: "Failed to set user password",
            };
        }

        return {
            success: true,
        };
    } catch (error) {
        console.error("Set password error:", error);
        return {
            error: error instanceof Error ? error.message : "An unknown error occurred",
        };
    }
};
