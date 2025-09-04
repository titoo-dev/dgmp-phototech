import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     tags:
 *       - Projects
 *     summary: Get a project by ID
 *     description: Retrieve a specific project by its ID with associated company information
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *         example: "clx123abc"
 *     responses:
 *       200:
 *         description: Project retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 *   put:
 *     tags:
 *       - Projects
 *     summary: Update a project
 *     description: Update an existing project with new information
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *         example: "clx123abc"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Project title
 *                 example: "Updated Website Redesign"
 *               description:
 *                 type: string
 *                 description: Project description
 *                 example: "Updated project description"
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Project start date
 *                 example: "2024-01-01T00:00:00Z"
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: Project end date
 *                 example: "2024-08-30T00:00:00Z"
 *               status:
 *                 type: string
 *                 description: Project status
 *                 enum: [UNCONTROLLED, CONTROLLED_IN_PROGRESS, CONTROLLED_DELIVERED, CONTROLLED_OTHER, DISPUTED]
 *                 example: "CONTROLLED_IN_PROGRESS"
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
 *       200:
 *         description: Project updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     tags:
 *       - Projects
 *     summary: Delete a project
 *     description: Delete a project by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *         example: "clx123abc"
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Project deleted successfully"
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        company: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
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
    const { title, description, startDate, endDate, status, companyId, nature } = body;

    const project = await prisma.project.update({
      where: { id },
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

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
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
    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
