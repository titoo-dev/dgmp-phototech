/**
 * Gallery API Route
 *
 * GET /api/gallery - Get photos with role-based filtering
 *
 * Query params:
 *   - projectId: string - Filter by project ID
 *   - missionId: string - Filter by mission ID
 *   - companyId: string - Filter by company ID
 *   - startDate: string - Filter photos after this date (ISO format)
 *   - endDate: string - Filter photos before this date (ISO format)
 *   - page: number - Page number (default: 1)
 *   - limit: number - Items per page (default: 20, max: 100)
 *
 * Role-based access:
 *   - u1: Only sees photos from missions where they are team leader
 *   - u2, u4: Can see all photos
 *   - u3: Only sees photos from COMPLETED missions
 */

import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserRole, type AuthUser } from '@/lib/auth-utils';
import { MissionStatus, Prisma } from '@/lib/generated/prisma';

export async function GET(request: NextRequest) {
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

    // Parse query params
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const missionId = searchParams.get('missionId');
    const companyId = searchParams.get('companyId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const skip = (page - 1) * limit;

    // Build where clause with role-based filtering
    const whereClause: Prisma.MissionFileWhereInput = {
      missionProject: {
        mission: {
          organizationId,
          // u1: only their missions
          ...(userRole === 'u1' && { teamLeaderId: user.id }),
          // u3: only completed missions
          ...(userRole === 'u3' && { status: MissionStatus.COMPLETED }),
          // Filter by missionId if provided
          ...(missionId && { id: missionId }),
        },
        // Filter by projectId if provided
        ...(projectId && { projectId }),
        // Filter by companyId through project
        ...(companyId && {
          project: {
            companyId,
          },
        }),
      },
      // Date filtering
      ...(startDate && { createdAt: { gte: new Date(startDate) } }),
      ...(endDate && { createdAt: { lte: new Date(endDate) } }),
    };

    // Get total count for pagination
    const totalCount = await prisma.missionFile.count({
      where: whereClause,
    });

    // Get photos with pagination
    const photos = await prisma.missionFile.findMany({
      where: whereClause,
      include: {
        missionProject: {
          include: {
            project: {
              include: {
                company: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    phoneNumber: true,
                  },
                },
              },
            },
            mission: {
              include: {
                teamLeader: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: photos,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching gallery photos:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gallery photos' },
      { status: 500 }
    );
  }
}
