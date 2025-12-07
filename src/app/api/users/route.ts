/**
 * Users API Routes
 *
 * GET /api/users - List users with filtering and pagination
 * POST /api/users - Invite a new user to the organization
 *
 * Query params for GET:
 *   - search: string - Search by name or email
 *   - role: string - Filter by role (u1, u2, u3, u4) or "all"
 *   - status: string - Filter by status (active, inactive, pending) or "all"
 *   - page: number - Page number (default: 1)
 *   - limit: number - Items per page (default: 10, max: 100)
 *   - sortBy: string - Sort field (default: name)
 *   - sortDirection: 'asc' | 'desc' - Sort direction (default: desc)
 *
 * Roles: u2, u4 can access (u4 excluded from results)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserRole, type AuthUser } from '@/lib/auth-utils';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const InviteUserSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  role: z.enum(['u1', 'u2', 'u3'], {
    message: 'Rôle invalide',
  }),
});

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

    if (!['u2', 'u4'].includes(userRole)) {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      );
    }

    // Parse query params
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')));
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortDirection = searchParams.get('sortDirection') === 'asc' ? 'asc' : 'desc';

    // Build query using Better Auth
    const query: any = {
      searchValue: search || undefined,
      searchField: 'name',
      searchOperator: 'contains',
      limit: 1000, // Get more to filter client-side
      offset: 0,
      sortBy,
      sortDirection,
    };

    // Role filtering
    if (role && role !== 'all') {
      query.filterField = 'role';
      query.filterValue = role;
      query.filterOperator = 'eq';
    } else {
      // Exclude u4 admins by default
      query.filterField = 'role';
      query.filterValue = 'u4';
      query.filterOperator = 'ne';
    }

    const result = await auth.api.listUsers({
      query,
      headers: request.headers,
    });

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch users' },
        { status: 500 }
      );
    }

    let filteredUsers = result.users || [];

    // Always exclude u4 users
    filteredUsers = filteredUsers.filter((u: any) => u.role !== 'u4');

    // Apply status filtering
    if (status && status !== 'all') {
      filteredUsers = filteredUsers.filter((u: any) => {
        switch (status) {
          case 'active':
            return !u.banned && u.emailVerified;
          case 'inactive':
            return u.banned;
          case 'pending':
            return !u.banned && !u.emailVerified;
          default:
            return true;
        }
      });
    }

    // Apply pagination
    const totalCount = filteredUsers.length;
    const skip = (page - 1) * limit;
    const paginatedUsers = filteredUsers.slice(skip, skip + limit);
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: paginatedUsers,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const validationResult = InviteUserSchema.safeParse(body);

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

    const { email, role } = validationResult.data;

    // Check if user is already a member
    const existingMember = await prisma.member.findFirst({
      where: {
        organizationId,
        user: { email },
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { success: false, error: 'Cet utilisateur est déjà membre de l\'organisation' },
        { status: 409 }
      );
    }

    // Check for existing pending invitation
    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        organizationId,
        email,
        status: 'pending',
      },
    });

    if (existingInvitation) {
      return NextResponse.json(
        { success: false, error: 'Une invitation en attente existe déjà pour cet utilisateur' },
        { status: 409 }
      );
    }

    // Create invitation
    const invitation = await auth.api.createInvitation({
      body: {
        email,
        role,
        organizationId,
        resend: true,
      },
      headers: request.headers,
    });

    return NextResponse.json(
      {
        success: true,
        data: invitation,
        message: `Invitation envoyée à ${email}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error inviting user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to invite user' },
      { status: 500 }
    );
  }
}
