/**
 * Project Status API Route
 *
 * PUT /api/projects/:id/status - Update only the project status
 *
 * Body: { status: 'UNCONTROLLED' | 'CONTROLLED_IN_PROGRESS' | 'CONTROLLED_DELIVERED' | 'CONTROLLED_OTHER' | 'DISPUTED' }
 *
 * Roles: u2, u4 can access
 */

import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserRole, type AuthUser } from '@/lib/auth-utils';
import { z } from 'zod';

const UpdateStatusSchema = z.object({
  status: z.enum(['UNCONTROLLED', 'CONTROLLED_IN_PROGRESS', 'CONTROLLED_DELIVERED', 'CONTROLLED_OTHER', 'DISPUTED'], {
    message: 'Statut invalide',
  }),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const organizationId = session.session.activeOrganizationId;
    if (!organizationId) {
      return NextResponse.json(
        { success: false, error: 'Organization required' },
        { status: 403 }
      );
    }

    const user = session.user as AuthUser;
    const userRole = getUserRole(user);

    if (!['u2', 'u4'].includes(userRole)) {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const validationResult = UpdateStatusSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Check if project exists
    const existingProject = await prisma.project.findFirst({
      where: { id, organizationId },
    });

    if (!existingProject) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    const project = await prisma.project.update({
      where: { id },
      data: { status: validationResult.data.status },
      include: {
        company: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Error updating project status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update project status' },
      { status: 500 }
    );
  }
}
