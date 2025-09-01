"use server";

import prisma from "@/lib/prisma";
import type { UserModel } from "@/models/user-schema";

export type GetUsersState = {
    users: UserModel[];
    error?: string;
};

/**
 * Server action to fetch users with specific role
 * @param role - Optional role filter (e.g., "u1")
 * @returns GetUsersState with users data or error
 */
export async function getUsersAction(role?: string): Promise<GetUsersState> {
    try {
        const users = await prisma.user.findMany({
            where: role ? { role } : undefined,
            orderBy: { name: 'asc' },
        });

        const userModels: UserModel[] = users.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified,
            image: user.image,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            role: user.role,
            banned: user.banned,
            banReason: user.banReason,
            banExpires: user.banExpires,
        }));

        return {
            users: userModels,
        };
    } catch (error) {
        console.error("Error fetching users:", error);
        
        return {
            users: [],
            error: "Une erreur est survenue lors du chargement des utilisateurs",
        };
    }
}

/**
 * Server action to fetch team leaders (users with "u1" role)
 */
export async function getTeamLeadersAction(): Promise<GetUsersState> {
    return getUsersAction("u1");
}
