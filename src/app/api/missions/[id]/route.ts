import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getMissionAction } from '@/actions/mission/get-mission-action';

/**
 * @swagger
 * /api/missions/{id}:
 *   get:
 *     tags:
 *       - Missions
 *     summary: Get a mission by ID (role-based access)
 *     description: |
 *       Retrieve a specific mission by its ID with role-based access control:
 *       - u1 users: Can only access missions where they are the team leader
 *       - u2 users: Can access any mission
 *       - u3 users: Can only access missions with COMPLETED status
 *       - u4 users: Can access any mission
 *       Returns mission with associated team leader, members, and project information
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mission ID
 *         example: "clx123abc"
 *     responses:
 *       200:
 *         description: Mission retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mission'
 *       401:
 *         description: Unauthorized - user not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not authenticated"
 *       403:
 *         description: Forbidden - access denied for u1 users accessing other's missions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Access denied: You can only view your own missions"
 *       404:
 *         description: Mission not found
 *       500:
 *         description: Internal server error
 *   put:
 *     tags:
 *       - Missions
 *     summary: Update a mission
 *     description: Update an existing mission with new information
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mission ID
 *         example: "clx123abc"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               missionNumber:
 *                 type: string
 *                 description: Mission number
 *                 example: "MIS-2024-001"
 *               teamLeaderId:
 *                 type: string
 *                 description: ID of the team leader responsible for this mission
 *                 example: "clx123abc"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Mission start date
 *                 example: "2024-01-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: Mission end date
 *                 example: "2024-01-20"
 *               location:
 *                 type: string
 *                 description: Mission location
 *                 example: "Lyon, France"
 *               status:
 *                 type: string
 *                 description: Mission status
 *                 enum: [DRAFT, PENDING, COMPLETED, REJECTED]
 *                 example: "COMPLETED"
 *               agentCount:
 *                 type: integer
 *                 description: Number of agents in mission
 *                 example: 5
 *               marketCount:
 *                 type: integer
 *                 description: Number of markets in mission
 *                 example: 3
 *     responses:
 *       200:
 *         description: Mission updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mission'
 *       404:
 *         description: Mission not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     tags:
 *       - Missions
 *     summary: Delete a mission
 *     description: Delete a mission by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mission ID
 *         example: "clx123abc"
 *     responses:
 *       200:
 *         description: Mission deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Mission deleted successfully"
 *       404:
 *         description: Mission not found
 *       500:
 *         description: Internal server error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const mission = await getMissionAction(id);
    return NextResponse.json(mission);
  } catch (error) {
    console.error('Error fetching mission:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message === 'User not authenticated') {
        return NextResponse.json(
          { error: error.message },
          { status: 401 }
        );
      }
      if (error.message === 'Access denied: You can only view your own missions') {
        return NextResponse.json(
          { error: error.message },
          { status: 403 }
        );
      }
      if (error.message === 'Access denied: You can only view completed missions') {
        return NextResponse.json(
          { error: error.message },
          { status: 403 }
        );
      }
      if (error.message === 'Mission not found') {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch mission' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { missionNumber, teamLeaderId, startDate, endDate, location, status, agentCount = 0, marketCount = 0 } = body;

    const mission = await prisma.mission.update({
      where: { id },
      data: {
        missionNumber,
        teamLeaderId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        location,
        status,
        agentCount,
        marketCount,
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

    return NextResponse.json(mission);
  } catch (error) {
    console.error('Error updating mission:', error);
    return NextResponse.json(
      { error: 'Failed to update mission' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.mission.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Mission deleted successfully' });
  } catch (error) {
    console.error('Error deleting mission:', error);
    return NextResponse.json(
      { error: 'Failed to delete mission' },
      { status: 500 }
    );
  }
}
