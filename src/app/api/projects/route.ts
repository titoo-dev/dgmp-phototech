import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

/**
 * @swagger
 * /api/projects:
 *   get:
 *     tags:
 *       - Projects
 *     summary: Get all projects
 *     description: Retrieve a list of all projects with their associated company information
 *     responses:
 *       200:
 *         description: List of projects retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *       500:
 *         description: Internal server error
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
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        company: true,
      },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, startDate, endDate, status, companyId, nature } = body;

    const project = await prisma.project.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status,
        companyId,
        nature,
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
