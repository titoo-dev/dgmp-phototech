/**
 * User Ban API Route
 *
 * POST /api/users/:id/ban - Ban a user
 * DELETE /api/users/:id/ban - Unban a user
 *
 * POST Body: { reason: string, expiresIn?: number (days, default: 30) }
 *
 * Roles: u4 only can access
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserRole, type AuthUser } from '@/lib/auth-utils';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const BanUserSchema = z.object({
  reason: z.string().min(1, 'La raison du bannissement est requise'),
  expiresIn: z.number().min(1).optional().default(30),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: RouteParams) {
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

    // Only u4 can ban users
    if (currentUserRole !== 'u4') {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Only administrators can ban users' },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Prevent self-ban
    if (id === currentUser.id) {
      return NextResponse.json(
        { success: false, error: 'Vous ne pouvez pas vous bannir vous-même' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validationResult = BanUserSchema.safeParse(body);

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

    const { reason, expiresIn } = validationResult.data;

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

    if (existingUser.banned) {
      return NextResponse.json(
        { success: false, error: 'Cet utilisateur est déjà banni' },
        { status: 400 }
      );
    }

    // Ban user via Better Auth
    await auth.api.banUser({
      body: {
        userId: id,
        banReason: reason,
        banExpiresIn: expiresIn,
      },
      headers: request.headers,
    });

    return NextResponse.json({
      success: true,
      message: 'Utilisateur banni avec succès',
    });
  } catch (error) {
    console.error('Error banning user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to ban user' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    // Only u4 can unban users
    if (currentUserRole !== 'u4') {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Only administrators can unban users' },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    if (!existingUser.banned) {
      return NextResponse.json(
        { success: false, error: 'Cet utilisateur n\'est pas banni' },
        { status: 400 }
      );
    }

    // Unban user via Better Auth
    await auth.api.unbanUser({
      body: { userId: id },
      headers: request.headers,
    });

    return NextResponse.json({
      success: true,
      message: 'Utilisateur débanni avec succès',
    });
  } catch (error) {
    console.error('Error unbanning user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to unban user' },
      { status: 500 }
    );
  }
}
