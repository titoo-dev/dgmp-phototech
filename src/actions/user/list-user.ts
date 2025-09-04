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
        const users = await auth.api.listUsers({
            query: {
                searchValue: params.searchValue,
                searchField: params.searchField ? params.searchField as "email" | "name" : "name",
                searchOperator: "contains",
                limit: params.limit ? params.limit : 100,
                offset: params.offset ? params.offset : 0,
                sortBy: params.sortBy ? params.sortBy : "name",
                sortDirection: params.sortDirection ? params.sortDirection : "desc",
                filterField: "role",
                filterValue: "u4",
                filterOperator: "ne",
            },
            headers: await headers(),
        });

        if (!users) {
            return {
                error: "Failed to fetch users",
            };
        }

        return {
            users: users.users,
            total: users.total,
        };
    } catch (error) {
        console.error("List users error:", error);
        return {
            error: error instanceof Error ? error.message : "An unknown error occurred",
        };
    }
};
