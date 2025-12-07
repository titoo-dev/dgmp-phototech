/**
 * Mission Review API Route
 *
 * POST /api/missions/:id/review - Reject a mission with review comment (PENDING → REJECTED)
 *
 * Body: { comment: string } - Review comment explaining why the mission was rejected
 *
 * Sends email notification to team leader with review comments.
 *
 * Roles: u2, u4 can access
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserRole, type AuthUser } from '@/lib/auth-utils';
import { reviewMissionAction } from '@/actions/mission/review-mission-action';
import { z } from 'zod';

const ReviewSchema = z.object({
  comment: z.string()
    .min(1, 'Le commentaire de révision est requis')
    .max(1000, 'Le commentaire ne peut pas dépasser 1000 caractères'),
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

    const user = session.user as AuthUser;
    const userRole = getUserRole(user);

    if (!['u2', 'u4'].includes(userRole)) {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Only u2 and u4 users can review missions' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const validationResult = ReviewSchema.safeParse(body);

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

    const result = await reviewMissionAction(id, validationResult.data.comment);

    if (!result.success) {
      const errorMessage = result.errors?._form?.[0] || 'Failed to review mission';
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error('Error reviewing mission:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to review mission' },
      { status: 500 }
    );
  }
}
