"use server";

import prisma from "@/lib/prisma";
import type { UserModel } from "@/models/user-schema";
import { getAuth } from "@/actions/get-auth";

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
        // Get current user's role to implement role-based filtering
        const { userRole } = await getAuth();

        let whereClause: any = {};

        // Apply role-based filtering based on current user's role
        if (userRole === "u2") {
            // u2 users can only manage u1 users
            whereClause = { role: "u1" };
        } else if (role) {
            // For other roles, respect the role parameter
            whereClause = { role };
        } else {
            // For other roles, exclude admin users (u4) by default
            whereClause = { 
                role: {
                    not: "u4"
                }
            };
        }

        const users = await prisma.user.findMany({
            where: whereClause,
            orderBy: { name: 'asc' },
        });

        const userModels: UserModel[] = users
            .filter((user) => user.role) // Filter out users with null roles
            .map((user) => ({
                id: user.id,
                name: user.name,
                email: user.email,
                emailVerified: user.emailVerified,
                phoneNumber: user.phoneNumber,
                image: user.image,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                role: user.role!, // Use non-null assertion since we filtered out nulls
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

export type ListUsersParams = {
    searchValue?: string;
    searchField?: string;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortDirection?: "asc" | "desc";
    role?: string;
    status?: string;
};

// Type for client component - ensures non-null role and string dates
export type ClientUser = {
    id: string;
    name: string;
    email: string;
    role: string; // Non-nullable role
    banned?: boolean;
    emailVerified?: boolean;
    createdAt: string; // String for client compatibility
    updatedAt: string; // String for client compatibility
    image?: string | null;
    banReason?: string | null;
    banExpires?: Date | null;
};

export type ListUsersState = {
    users?: ClientUser[];
    total?: number;
    error?: string;
};

/**
 * Server action to list users with pagination, search, and role-based filtering
 * @param params - Search and pagination parameters
 * @returns ListUsersState with users data, total count, or error
 */
export async function listUsersWithRoleFilterAction(
    params: ListUsersParams = {}
): Promise<ListUsersState> {
    try {
        // Get current user's role to implement role-based filtering
        const { userRole } = await getAuth();

        let whereClause: any = {};

        // Apply role-based filtering based on current user's role
        if (userRole === "u2") {
            // u2 users can only manage u1 users
            whereClause = { role: "u1" };
        } else if (params.role && params.role !== "all") {
            // For other roles, respect the role parameter
            whereClause = { role: params.role };
        } else {
            // For other roles, exclude admin users (u4) by default
            whereClause = { 
                role: {
                    not: "u4"
                }
            };
        }

        // Add search filtering
        if (params.searchValue) {
            const searchField = params.searchField || "name";
            whereClause[searchField] = {
                contains: params.searchValue,
                mode: 'insensitive'
            };
        }

        // Get total count for pagination
        const total = await prisma.user.count({
            where: whereClause,
        });

        // Get paginated users
        const users = await prisma.user.findMany({
            where: whereClause,
            orderBy: { 
                [params.sortBy || "name"]: params.sortDirection || "asc" 
            },
            skip: params.offset || 0,
            take: params.limit || 10,
        });

        let filteredUsers: ClientUser[] = users
            .filter((user) => user.role) // Filter out users with null roles
            .map((user) => ({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role!, // Use non-null assertion since we filtered out nulls
                banned: user.banned || false,
                emailVerified: user.emailVerified,
                createdAt: user.createdAt.toISOString(), // Convert Date to string
                updatedAt: user.updatedAt.toISOString(), // Convert Date to string
                image: user.image,
                banReason: user.banReason,
                banExpires: user.banExpires,
            }));

        // Apply status filtering on client side
        if (params.status && params.status !== "all") {
            filteredUsers = filteredUsers.filter((user: any) => {
                switch (params.status) {
                    case "active":
                        return !user.banned && user.emailVerified;
                    case "inactive":
                        return user.banned;
                    case "pending":
                        return !user.banned && !user.emailVerified;
                    default:
                        return true;
                }
            });
        }

        return {
            users: filteredUsers,
            total: filteredUsers.length, // Use filtered count for accurate pagination
        };
    } catch (error) {
        console.error("Error fetching users:", error);
        
        return {
            users: [],
            total: 0,
            error: "Une erreur est survenue lors du chargement des utilisateurs",
        };
    }
}
