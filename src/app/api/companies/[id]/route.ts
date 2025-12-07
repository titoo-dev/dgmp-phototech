/**
 * Company API Routes - Single Resource
 *
 * GET /api/companies/:id - Get a single company with projects
 * PUT /api/companies/:id - Update a company
 * DELETE /api/companies/:id - Delete a company (only if no projects)
 *
 * Roles: u1, u2, u4 can access
 */

import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserRole, type AuthUser } from '@/lib/auth-utils';
import { UpdateCompanyFormSchema } from '@/models/company-schema';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

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

    if (!['u1', 'u2', 'u4'].includes(userRole)) {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      );
    }

    const company = await prisma.company.findFirst({
      where: {
        id,
        organizationId,
      },
      include: {
        projects: {
          select: {
            id: true,
            title: true,
            description: true,
            startDate: true,
            endDate: true,
            status: true,
            nature: true,
          },
        },
      },
    });

    if (!company) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch company' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

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

    if (!['u1', 'u2', 'u4'].includes(userRole)) {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validationResult = UpdateCompanyFormSchema.safeParse({ ...body, id });

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

    const validated = validationResult.data;

    // Check if company exists
    const existing = await prisma.company.findFirst({
      where: { id, organizationId },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      );
    }

    // Check for duplicate email or NIF (excluding current company)
    if (validated.email || validated.nif) {
      const conflict = await prisma.company.findFirst({
        where: {
          organizationId,
          OR: [
            ...(validated.email ? [{ email: validated.email }] : []),
            ...(validated.nif ? [{ nif: validated.nif }] : []),
          ],
          AND: { id: { not: id } },
        },
      });

      if (conflict) {
        const field = conflict.email === validated.email ? 'email' : 'nif';
        return NextResponse.json(
          {
            success: false,
            error: field === 'email'
              ? 'Une entreprise avec cette adresse email existe déjà'
              : 'Une entreprise avec ce NIF existe déjà',
          },
          { status: 409 }
        );
      }
    }

    const updateData: any = {};
    if (validated.name !== undefined) updateData.name = validated.name;
    if (validated.email !== undefined) updateData.email = validated.email;
    if (validated.phoneNumber !== undefined) updateData.phoneNumber = validated.phoneNumber;
    if (validated.nif !== undefined) updateData.nif = validated.nif;
    if (validated.employeeCount !== undefined) updateData.employeeCount = validated.employeeCount;

    const company = await prisma.company.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.error('Error updating company:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update company' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

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

    if (!['u1', 'u2', 'u4'].includes(userRole)) {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      );
    }

    // Check if company exists and has no projects
    const company = await prisma.company.findFirst({
      where: { id, organizationId },
      include: {
        projects: { select: { id: true } },
      },
    });

    if (!company) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      );
    }

    if (company.projects.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Impossible de supprimer cette entreprise car elle a des marchés associés',
        },
        { status: 409 }
      );
    }

    await prisma.company.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Company deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting company:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete company' },
      { status: 500 }
    );
  }
}
