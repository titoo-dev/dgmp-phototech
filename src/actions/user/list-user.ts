"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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

export type ListUsersState = {
    users?: any[];
    total?: number;
    error?: string;
};

export const listUsersAction = async (
    params: ListUsersParams = {}
): Promise<ListUsersState> => {
    try {
        // Build base query parameters
        const query: any = {
            searchValue: params.searchValue,
            searchField: params.searchField ? params.searchField as "email" | "name" : "name",
            searchOperator: "contains",
            limit: 1000, // Get more users to filter on client side
            offset: 0,
            sortBy: params.sortBy ? params.sortBy : "name",
            sortDirection: params.sortDirection ? params.sortDirection : "desc",
        };

        // Handle role filtering - if specific role is selected, filter for that role
        // Otherwise, exclude admin users (u4 role)
        if (params.role && params.role !== "all") {
            query.filterField = "role";
            query.filterValue = params.role;
            query.filterOperator = "eq";
        } else {
            // Always exclude admin users (u4 role) when no specific role is selected
            query.filterField = "role";
            query.filterValue = "u4";
            query.filterOperator = "ne";
        }

        const users = await auth.api.listUsers({
            query,
            headers: await headers(),
        });

        if (!users) {
            return {
                error: "Failed to fetch users",
            };
        }

        let filteredUsers = users.users || [];

        // Always exclude admin users from results
        filteredUsers = filteredUsers.filter((user: any) => user.role !== "u4");

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

        // Apply pagination to filtered results
        const limit = params.limit || 10;
        const offset = params.offset || 0;
        const total = filteredUsers.length;
        const paginatedUsers = filteredUsers.slice(offset, offset + limit);

        return {
            users: paginatedUsers,
            total: total,
        };
    } catch (error) {
        console.error("List users error:", error);
        return {
            error: error instanceof Error ? error.message : "An unknown error occurred",
        };
    }
};
