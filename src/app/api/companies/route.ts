/**
 * Company API Routes
 *
 * GET /api/companies - List all companies (requires auth, org-scoped)
 * POST /api/companies - Create a new company (requires auth, org-scoped)
 *
 * Query params for GET:
 *   - search: string - Search by name, email, phone, or NIF
 *
 * Roles: u1, u2, u4 can access
 */

import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserRole, type AuthUser } from '@/lib/auth-utils';
import { CreateCompanySchema } from '@/models/company-schema';

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

    if (!['u1', 'u2', 'u4'].includes(userRole)) {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      );
    }

    // Get search query param
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    const whereClause: any = { organizationId };

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phoneNumber: { contains: search, mode: 'insensitive' } },
        { nif: { contains: search, mode: 'insensitive' } },
      ];
    }

    const companies = await prisma.company.findMany({
      where: whereClause,
      include: {
        projects: {
          select: { id: true },
        },
      },
      orderBy: { id: 'desc' },
    });

    const companiesWithCounts = companies.map((company) => ({
      id: company.id,
      name: company.name,
      email: company.email,
      phoneNumber: company.phoneNumber,
      nif: company.nif,
      employeeCount: company.employeeCount,
      projectsCount: company.projects.length,
    }));

    return NextResponse.json({
      success: true,
      data: companiesWithCounts,
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch companies' },
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

    if (!['u1', 'u2', 'u4'].includes(userRole)) {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validationResult = CreateCompanySchema.safeParse(body);

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

    const validatedData = validationResult.data;

    // Check for duplicate email or NIF
    const existingCompany = await prisma.company.findFirst({
      where: {
        organizationId,
        OR: [
          { email: validatedData.email },
          { nif: validatedData.nif },
        ],
      },
    });

    if (existingCompany) {
      const field = existingCompany.email === validatedData.email ? 'email' : 'nif';
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

    const company = await prisma.company.create({
      data: {
        ...validatedData,
        organization: { connect: { id: organizationId } },
      },
    });

    return NextResponse.json(
      { success: true, data: company },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create company' },
      { status: 500 }
    );
  }
}
