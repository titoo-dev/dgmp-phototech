"use server";

import prisma from "@/lib/prisma";
import { requireOrganization } from "@/lib/auth-guard";

export type MissionWithRelations = {
    id: string;
    missionNumber: string;
    teamLeaderId: string;
    startDate: Date;
    endDate: Date;
    location: string;
    agentCount: number;
    marketCount: number;
    status: 'DRAFT' | 'PENDING' | 'COMPLETED' | 'REJECTED';
    teamLeader: {
        id: string;
        name: string;
        email: string;
        emailVerified: boolean;
        image: string | null;
        phoneNumber: string | null;
        createdAt: Date;
        updatedAt: Date;
        role: string | null;
    };
    members: Array<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    }>;
    missionProjects: Array<{
        id: string;
        projectId: string;
        notes: string;
        missionId: string;
        files: Array<{
            id: string;
            fileUrl: string;
            metadata: string;
            createdAt: Date;
            missionProjectId: string;
        }>;
        project: {
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
        };
    }>;
};

export async function getMissionsAction(): Promise<
    | { success: true; data: MissionWithRelations[] }
    | { success: false; error: string; data?: undefined }
> {
    try {
        const { organizationId } = await requireOrganization();

        const missions = await prisma.mission.findMany({
            where: {
                organizationId,
            },
            include: {
                teamLeader: true,
                members: true,
                missionProjects: {
                    include: {
                        project: {
                            include: {
                                company: true
                            }
                        },
                        files: true,
                    }
                }
            },
            orderBy: {
                startDate: 'desc'
            }
        });

        return {
            success: true,
            data: missions as unknown as MissionWithRelations[]
        };
    } catch (error) {
        console.error('Failed to fetch missions:', error);
        return {
            success: false,
            error: 'Failed to fetch missions'
        };
    }
}