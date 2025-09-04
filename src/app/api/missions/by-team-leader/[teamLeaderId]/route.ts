import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

/**
 * @swagger
 * /api/missions/by-team-leader/{teamLeaderId}:
 *   get:
 *     tags:
 *       - Missions
 *     summary: Get missions by team leader
 *     description: Retrieve all missions for a specific team leader
 *     parameters:
 *       - in: path
 *         name: teamLeaderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Team leader ID to filter missions by
 *         example: "clx123abc"
 *     responses:
 *       200:
 *         description: Missions for the team leader retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mission'
 *       500:
 *         description: Internal server error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ teamLeaderId: string }> }
) {
  try {
    const { teamLeaderId } = await params;

    const missions = await prisma.mission.findMany({
      where: {
        teamLeaderId: teamLeaderId,
      },
      include: {
        teamLeader: true,
        members: true,
        missionProjects: {
          include: {
            project: {
              include: {
                company: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(missions);
  } catch (error) {
    console.error('Error fetching missions by team leader:', error);
    return NextResponse.json(
      { error: 'Failed to fetch missions by team leader' },
      { status: 500 }
    );
  }
}
