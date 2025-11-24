import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserRole, type AuthUser } from '@/lib/auth-utils';
import { createContactAction } from '@/actions/contact/create-contact-action';

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     tags:
 *       - Contacts
 *     summary: Get all contacts (u1 role only)
 *     description: Retrieve a list of all contacts ordered by first name and last name. Only accessible by u1 role users.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer token with u1 role
 *         schema:
 *           type: string
 *           example: "Bearer your-jwt-token"
 *     responses:
 *       200:
 *         description: List of contacts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 *       401:
 *         description: Unauthorized - user not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       403:
 *         description: Forbidden - only u1 and u4 users can access contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Forbidden - Only u1 users can access contacts"
 *       500:
 *         description: Internal server error
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const organizationId = session.session.activeOrganizationId;
    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization required' },
        { status: 403 }
      );
    }

    // Check if user has u1 role
    const user = session.user as AuthUser;
    const userRole = getUserRole(user);

    if (!['u1', 'u4'].includes(userRole)) {
      return NextResponse.json(
        { error: 'Forbidden - Only u1 and u4 users can access contacts' },
        { status: 403 }
      );
    }

    const contacts = await prisma.contact.findMany({
      where: {
        organizationId,
      },
      orderBy: [
        { firstName: 'asc' },
        { lastName: 'asc' }
      ],
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}


/**
 * @swagger
 * /api/contacts:
 *   post:
 *     tags:
 *       - Contacts
 *     summary: Create a new contact
 *     description: Create a new contact with first name, last name, and email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: Contact's first name
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 description: Contact's last name
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Contact's email address
 *                 example: "john.doe@example.com"
 *     responses:
 *       201:
 *         description: Contact created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Bad request - validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to create contact"
 *                 errors:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["First name is required"]
 *                     lastName:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Last name is required"]
 *                     email:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Un contact avec cette adresse email existe déjà"]
 *       401:
 *         description: Unauthorized - no valid session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       403:
 *         description: Forbidden - insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Forbidden - Only u1 and u4 users can create contacts"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to create contact"
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has u1 role
    const user = session.user as AuthUser;
    const userRole = getUserRole(user);

    if (!['u1', 'u4'].includes(userRole)) {
      return NextResponse.json(
        { error: 'Forbidden - Only u1 and u4 users can create contacts' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { firstName, lastName, email } = body;

    // Create FormData to match the action's expected input
    const formData = new FormData();
    formData.append('firstName', firstName || '');
    formData.append('lastName', lastName || '');
    formData.append('email', email || '');

    // Use the existing server action
    const result = await createContactAction({}, formData);

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Failed to create contact',
          errors: result.errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error('API Error creating contact:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
