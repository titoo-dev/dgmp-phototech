"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const SetUserRoleSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    role: z.enum(["u1", "u2", "u3", "u4"]),
});

export type SetUserRoleFormState = {
    success?: boolean;
    error?: string;
    fieldErrors?: {
        userId?: string[];
        role?: string[];
    };
};

export const setUserRoleAction = async (
    prevState: SetUserRoleFormState,
    formData: FormData
): Promise<SetUserRoleFormState> => {
    try {
        const rawData = {
            userId: formData.get("userId") as string,
            role: formData.get("role") as string,
        };

        const validatedData = SetUserRoleSchema.safeParse(rawData);

        if (!validatedData.success) {
            return {
                error: "Please check your input and try again",
                fieldErrors: validatedData.error.flatten().fieldErrors,
            };
        }

        const { userId, role } = validatedData.data;

        const data = await auth.api.setRole({
            body: {
                userId: userId,
                role: role,
            },
            headers: await headers(),
        });

        if (!data) {
            return {
                error: "Failed to update user role",
            };
        }

        return {
            success: true,
        };
    } catch (error) {
        console.error("Update user error:", error);
        return {
            error: error instanceof Error ? error.message : "An unknown error occurred",
        };
    }
};
