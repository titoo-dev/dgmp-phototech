"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const removeUserSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
});

export type RemoveUserFormState = {
    success?: boolean;
    error?: string;
    fieldErrors?: {
        userId?: string[];
    };
};

export const removeUserAction = async (
    prevState: RemoveUserFormState,
    formData: FormData
): Promise<RemoveUserFormState> => {
    try {
        const rawData = {
            userId: formData.get("userId") as string,
        };

        const validatedData = removeUserSchema.safeParse(rawData);

        if (!validatedData.success) {
            return {
                error: "Please check your input and try again",
                fieldErrors: validatedData.error.flatten().fieldErrors,
            };
        }

        const { userId } = validatedData.data;

        const deletedUser = await auth.api.removeUser({
            body: {
                userId: userId,
            },
            headers: await headers(),
        });

        if (!deletedUser) {
            return {
                error: "Failed to remove user",
            };
        }

        return {
            success: true,
        };
    } catch (error) {
        console.error("Remove user error:", error);
        return {
            error: error instanceof Error ? error.message : "An unknown error occurred",
        };
    }
};
