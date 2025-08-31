"use server";

import prisma from "@/lib/prisma";
import { CompanyModel } from "@/models/company-schema";

export type GetCompaniesState = {
    companies: CompanyModel[];
    error?: string;
};

/**
 * Server action to fetch all companies with their project counts
 * @returns GetCompaniesState with companies data or error
 */
export async function getCompaniesAction(): Promise<GetCompaniesState> {
    try {
        const companies = await prisma.company.findMany({
            include: {
                projects: {
                    select: {
                        id: true,
                    },
                },
            },
            orderBy: { id: 'desc' },
        });

        // Transform the data to match CompanyModel schema
        const companiesWithCounts: CompanyModel[] = companies.map((company) => ({
            id: company.id,
            name: company.name,
            email: company.email,
            phoneNumber: company.phoneNumber,
            nif: company.nif,
            employeeCount: company.employeeCount,
            projectsCount: company.projects.length,
        }));

        return {
            companies: companiesWithCounts,
        };
    } catch (error) {
        console.error("Error fetching companies:", error);
        
        return {
            companies: [],
            error: "Une erreur est survenue lors du chargement des entreprises",
        };
    }
}

/**
 * Server action to search companies by query
 * @param query - Search query to filter companies
 * @returns GetCompaniesState with filtered companies data or error
 */
export async function searchCompaniesAction(query: string): Promise<GetCompaniesState> {
    try {
        const companies = await prisma.company.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        email: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        phoneNumber: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                    {
                        nif: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                ],
            },
            include: {
                projects: {
                    select: {
                        id: true,
                    },
                },
            },
            orderBy: { id: 'desc' },
        });

        // Transform the data to match CompanyModel schema
        const companiesWithCounts: CompanyModel[] = companies.map((company) => ({
            id: company.id,
            name: company.name,
            email: company.email,
            phoneNumber: company.phoneNumber,
            nif: company.nif,
            employeeCount: company.employeeCount,
            projectsCount: company.projects.length,
        }));

        return {
            companies: companiesWithCounts,
        };
    } catch (error) {
        console.error("Error searching companies:", error);
        
        return {
            companies: [],
            error: "Une erreur est survenue lors de la recherche des entreprises",
        };
    }
}
