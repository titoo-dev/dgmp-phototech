/**
 * Mission Status API Route
 *
 * PUT /api/missions/:id/status - Update mission status directly
 *
 * Body: { status: 'DRAFT' | 'PENDING' | 'COMPLETED' | 'REJECTED' }
 *
 * Roles:
 *   - u1: Can only change their own missions from DRAFT to PENDING or REJECTED to DRAFT
 *   - u2, u4: Can change any mission to any status
 */

import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserRole, type AuthUser } from '@/lib/auth-utils';
import { z } from 'zod';
import { MissionStatus } from '@/lib/generated/prisma';

const UpdateStatusSchema = z.object({
  status: z.enum(['DRAFT', 'PENDING', 'COMPLETED', 'REJECTED'], {
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

    const newStatus = validationResult.data.status as MissionStatus;

    // Check if mission exists
    const existingMission = await prisma.mission.findFirst({
      where: { id, organizationId },
    });

    if (!existingMission) {
      return NextResponse.json(
        { success: false, error: 'Mission not found' },
        { status: 404 }
      );
    }

    // Role-based status transition rules
    if (userRole === 'u1') {
      // u1 can only modify their own missions
      if (existingMission.teamLeaderId !== user.id) {
        return NextResponse.json(
          { success: false, error: 'Forbidden - You can only modify your own missions' },
          { status: 403 }
        );
      }

      // u1 can only: DRAFT → PENDING or REJECTED → DRAFT
      const allowedTransitions: Record<string, string[]> = {
        DRAFT: ['PENDING'],
        REJECTED: ['DRAFT'],
      };

      const currentStatus = existingMission.status;
      if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
        return NextResponse.json(
          {
            success: false,
            error: `Transition de statut non autorisée: ${currentStatus} → ${newStatus}`,
          },
          { status: 403 }
        );
      }
    } else if (!['u2', 'u4'].includes(userRole)) {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      );
    }

    const mission = await prisma.mission.update({
      where: { id },
      data: { status: newStatus },
      include: {
        teamLeader: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: mission,
    });
  } catch (error) {
    console.error('Error updating mission status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update mission status' },
      { status: 500 }
    );
  }
}
