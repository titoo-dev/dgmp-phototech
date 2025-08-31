'use server'

import prisma from "@/lib/prisma";


export async function getProjectsAction(): Promise<
    | { success: true; data: ProjectWithCompany[] }
    | { success: false; error: string; data?: undefined }
> {
    try {
        const projects = await prisma.project.findMany({
            include: {
                company: true,
                // Include mission projects count for each project
                missionProjects: {
                    select: {
                        id: true,
                        mission: {
                            select: {
                                status: true,
                            }
                        }
                    }
                }
            },
            orderBy: {
                startDate: 'desc'
            }
        })

        return {
            success: true,
            data: projects as unknown as ProjectWithCompany[]
        }
    } catch (error) {
        console.error('Failed to fetch projects:', error)
        return {
            success: false,
            error: 'Failed to fetch projects'
        }
    }
}

// Define the type based on what we actually return
export type ProjectWithCompany = {
    id: string;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    status: 'UNCONTROLLED' | 'CONTROLLED_IN_PROGRESS' | 'CONTROLLED_DELIVERED' | 'CONTROLLED_OTHER' | 'DISPUTED';
    companyId: string;
    nature: 'SUPPLY' | 'SERVICES' | 'INTELLECTUAL' | 'PROGRAM' | 'MIXED' | 'CONTROLLED_EXPENSES';
    company: {
        id: string;
        name: string;
        email: string;
        phoneNumber: string;
        nif: string;
        employeeCount: number;
    };
    missionProjects: Array<{
        id: string;
        mission: {
            status: 'DRAFT' | 'PENDING' | 'COMPLETED' | 'REJECTED';
        };
    }>;
};
