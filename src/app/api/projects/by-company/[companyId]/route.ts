import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

/**
 * @swagger
 * /api/projects/by-company/{companyId}:
 *   get:
 *     tags:
 *       - Projects
 *     summary: Get projects by company
 *     description: Retrieve all projects for a specific company
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID to filter projects by
 *         example: "clx123abc"
 *     responses:
 *       200:
 *         description: Projects for the company retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *       500:
 *         description: Internal server error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ companyId: string }> }
) {
  try {
    const { companyId } = await params;
    
    const projects = await prisma.project.findMany({
      where: {
        companyId: companyId,
      },
      include: {
        company: true,
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects by company:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects by company' },
      { status: 500 }
    );
  }
}
