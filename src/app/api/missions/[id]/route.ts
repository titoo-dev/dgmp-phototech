import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

/**
 * @swagger
 * /api/missions/{id}:
 *   get:
 *     tags:
 *       - Missions
 *     summary: Get a mission by ID
 *     description: Retrieve a specific mission by its ID with associated team leader, members, and project information
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
    const mission = await prisma.mission.findUnique({
      where: { id },
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

    if (!mission) {
      return NextResponse.json(
        { error: 'Mission not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(mission);
  } catch (error) {
    console.error('Error fetching mission:', error);
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
