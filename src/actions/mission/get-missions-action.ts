'use server'

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserRole, AuthUser } from "@/lib/auth-utils";

export async function getMissionsAction(): Promise<
    | { success: true; data: MissionWithRelations[] }
    | { success: false; error: string; data?: undefined }
> {
    try {
        // Get current user session
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return {
                success: false,
                error: 'User not authenticated'
            };
        }

        const userRole = getUserRole(session.user as AuthUser);
        
        // Role-based filtering
        let whereClause = {};
        
        if (userRole === 'u1') {
            // u1 users: only see their own missions
            whereClause = { teamLeaderId: session.user.id };
        } else if (userRole === 'u3') {
            // u3 users: only see completed missions
            whereClause = { status: 'COMPLETED' };
        } else {
            // u2 and u4 users: see all missions
            whereClause = {};
        }

        const missions = await prisma.mission.findMany({
            where: whereClause,
            include: {
                teamLeader: true,
                members: true,
                missionProjects: {
                    include: {
                        project: {
                            include: {
                                company: true
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
            data: missions as unknown as MissionWithRelations[]
        }
    } catch (error) {
        console.error('Failed to fetch missions:', error)
        return {
            success: false,
            error: 'Failed to fetch missions'
        }
    }
}

// Define the type based on what we actually return
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