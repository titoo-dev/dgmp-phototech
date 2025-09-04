"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const banUserSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    banReason: z.string().min(1, "Ban reason is required"),
    banExpiresIn: z.number().min(1, "Ban duration must be greater than 0"),
});

export type BanUserFormState = {
    success?: boolean;
    error?: string;
    fieldErrors?: {
        userId?: string[];
        banReason?: string[];
        banExpiresIn?: string[];
    };
};

export const banUserAction = async (
    prevState: BanUserFormState,
    formData: FormData
): Promise<BanUserFormState> => {
    try {
        const rawData = {
            userId: formData.get("userId") as string,
            banReason: formData.get("banReason") as string,
            banExpiresIn: Number(formData.get("banExpiresIn")),
        };

        const validatedData = banUserSchema.safeParse(rawData);

        if (!validatedData.success) {
            return {
                error: "Please check your input and try again",
                fieldErrors: validatedData.error.flatten().fieldErrors,
            };
        }

        const { userId, banReason, banExpiresIn } = validatedData.data;

        const data = await auth.api.banUser({
            body: {
                userId: userId,
                banReason: banReason,
                banExpiresIn: banExpiresIn,
            },
            headers: await headers(),
        });

        if (!data) {
            return {
                error: "Failed to ban user",
            };
        }

        return {
            success: true,
        };
    } catch (error) {
        console.error("Ban user error:", error);
        return {
            error: error instanceof Error ? error.message : "An unknown error occurred",
        };
    }
};
