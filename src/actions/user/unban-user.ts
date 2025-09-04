"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const unbanUserSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
});

export type UnbanUserFormState = {
    success?: boolean;
    error?: string;
    fieldErrors?: {
        userId?: string[];
    };
};

export const unbanUserAction = async (
    prevState: UnbanUserFormState,
    formData: FormData
): Promise<UnbanUserFormState> => {
    try {
        const rawData = {
            userId: formData.get("userId") as string,
        };

        const validatedData = unbanUserSchema.safeParse(rawData);

        if (!validatedData.success) {
            return {
                error: "Please check your input and try again",
                fieldErrors: validatedData.error.flatten().fieldErrors,
            };
        }

        const { userId } = validatedData.data;

        const data = await auth.api.unbanUser({
            body: {
                userId: userId,
            },
            headers: await headers(),
        });

        if (!data) {
            return {
                error: "Failed to unban user",
            };
        }

        return {
            success: true,
        };
    } catch (error) {
        console.error("Unban user error:", error);
        return {
            error: error instanceof Error ? error.message : "An unknown error occurred",
        };
    }
};
