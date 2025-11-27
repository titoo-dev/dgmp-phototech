import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserRole, type AuthUser } from '@/lib/auth-utils';

/**
 * @swagger
 * /api/projects:
 *   get:
 *     tags:
 *       - Projects
 *     summary: Get all projects with enhanced data
 *     description: |
 *       Retrieve a list of all projects with their associated company information and mission projects.
 *       Includes mission project counts and statuses for each project, ordered by start date (newest first).
 *       Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token for authentication
 *         schema:
 *           type: string
 *           example: "Bearer your-jwt-token"
 *     responses:
 *       200:
 *         description: List of projects retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/Project'
 *                       - type: object
 *                         properties:
 *                           missionProjects:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: string
 *                                   example: "clx123abc"
 *                                 mission:
 *                                   type: object
 *                                   properties:
 *                                     status:
 *                                       type: string
 *                                       enum: [DRAFT, PENDING, COMPLETED, REJECTED]
 *                                       example: "COMPLETED"
 *       401:
 *         description: Unauthorized - user not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch projects"
 *   post:
 *     tags:
 *       - Projects
 *     summary: Create a new project
 *     description: Create a new project with the provided information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - startDate
 *               - endDate
 *               - status
 *               - companyId
 *               - nature
 *             properties:
 *               title:
 *                 type: string
 *                 description: Project title
 *                 example: "Website Redesign"
 *               description:
 *                 type: string
 *                 description: Project description
 *                 example: "Complete redesign of company website"
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Project start date
 *                 example: "2024-01-01T00:00:00Z"
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: Project end date
 *                 example: "2024-06-30T00:00:00Z"
 *               status:
 *                 type: string
 *                 description: Project status
 *                 enum: [UNCONTROLLED, CONTROLLED_IN_PROGRESS, CONTROLLED_DELIVERED, CONTROLLED_OTHER, DISPUTED]
 *                 example: "UNCONTROLLED"
 *               companyId:
 *                 type: string
 *                 description: ID of the company this project belongs to
 *                 example: "clx123abc"
 *               nature:
 *                 type: string
 *                 description: Nature of the project
 *                 enum: [SUPPLY, SERVICES, INTELLECTUAL, PROGRAM, MIXED, CONTROLLED_EXPENSES]
 *                 example: "SERVICES"
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       500:
 *         description: Internal server error
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const organizationId = session.session.activeOrganizationId;
    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization required' },
        { status: 403 }
      );
    }

    const projects = await prisma.project.findMany({
      where: {
        organizationId,
      },
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
    });

    return NextResponse.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch projects'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const organizationId = session.session.activeOrganizationId;
    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, startDate, endDate, status, companyId, nature } = body;

    const project = await prisma.project.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status,
        company: { connect: { id: companyId } },
        nature,
        organization: { connect: { id: organizationId } },
      },
      include: {
        company: true,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
