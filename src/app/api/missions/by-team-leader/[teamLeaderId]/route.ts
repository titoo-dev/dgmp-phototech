import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserRole, AuthUser } from '@/lib/auth-utils';

/**
 * @swagger
 * /api/missions/by-team-leader/{teamLeaderId}:
 *   get:
 *     tags:
 *       - Missions
 *     summary: Get missions by team leader (role-based access)
 *     description: |
 *       Retrieve missions for a specific team leader with role-based access control:
 *       - u1 users: Can only access their own missions (teamLeaderId must match their user ID)
 *       - u2 users: Can access missions for any team leader
 *       - u3 users: Can access missions for any team leader, but only COMPLETED missions
 *       - u4 users: Can access missions for any team leader
 *     security:
 *       - bearerAuth: []
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
 *         description: Forbidden - u1 users can only access their own missions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Access denied: You can only view your own missions"
 *       500:
 *         description: Internal server error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ teamLeaderId: string }> }
) {
  try {
    const { teamLeaderId } = await params;

    // Get current user session for role-based access control
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const userRole = getUserRole(session.user as AuthUser);

    // Role-based access control: u1 users can only access their own missions
    if (userRole === 'u1' && teamLeaderId !== session.user.id) {
      return NextResponse.json(
        { error: 'Access denied: You can only view your own missions' },
        { status: 403 }
      );
    }

    // Build where clause based on role
    let whereClause: any = { teamLeaderId: teamLeaderId };
    
    if (userRole === 'u3') {
      // u3 users can only see completed missions
      whereClause.status = 'COMPLETED';
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
