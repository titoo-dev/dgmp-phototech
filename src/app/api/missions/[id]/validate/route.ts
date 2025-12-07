/**
 * Mission Validate API Route
 *
 * POST /api/missions/:id/validate - Validate a mission (PENDING → COMPLETED)
 *
 * Sends email notification to team leader upon validation.
 *
 * Roles: u2, u4 can access
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserRole, type AuthUser } from '@/lib/auth-utils';
import { validateMissionAction } from '@/actions/mission/validate-mission-action';

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
        { success: false, error: 'Forbidden - Only u2 and u4 users can validate missions' },
        { status: 403 }
      );
    }

    const { id } = await params;

    const result = await validateMissionAction(id);

    if (!result.success) {
      const errorMessage = result.errors?._form?.[0] || 'Failed to validate mission';
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
    console.error('Error validating mission:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to validate mission' },
      { status: 500 }
    );
  }
}
