/**
 * User Role API Route
 *
 * PUT /api/users/:id/role - Update user role
 *
 * Body: { role: 'u1' | 'u2' | 'u3' }
 *
 * Roles: u2, u4 can access
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserRole, type AuthUser } from '@/lib/auth-utils';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const UpdateRoleSchema = z.object({
  role: z.enum(['u1', 'u2', 'u3'], {
    message: 'Rôle invalide',
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

    const currentUser = session.user as AuthUser;
    const currentUserRole = getUserRole(currentUser);

    if (!['u2', 'u4'].includes(currentUserRole)) {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const validationResult = UpdateRoleSchema.safeParse(body);

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

    const { role } = validationResult.data;

    // Check if user exists and is member of org
    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: {
        members: {
          where: { organizationId },
        },
      },
    });

    if (!existingUser || existingUser.members.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found in this organization' },
        { status: 404 }
      );
    }

    // Prevent changing own role
    if (id === currentUser.id) {
      return NextResponse.json(
        { success: false, error: 'Vous ne pouvez pas modifier votre propre rôle' },
        { status: 400 }
      );
    }

    // Update role via Better Auth
    await auth.api.setRole({
      body: { userId: id, role },
      headers: request.headers,
    });

    // Fetch updated user
    const updatedUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user role' },
      { status: 500 }
    );
  }
}
