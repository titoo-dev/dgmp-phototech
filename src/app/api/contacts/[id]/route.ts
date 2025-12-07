/**
 * Contact API Routes - Single Resource
 *
 * GET /api/contacts/:id - Get a single contact
 * PUT /api/contacts/:id - Update a contact
 * DELETE /api/contacts/:id - Delete a contact (only if not used in missions)
 *
 * Roles: u1, u4 can access
 */

import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserRole, type AuthUser } from "@/lib/auth-utils";
import { UpdateContactSchema } from "@/models/contact-schema";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const organizationId = session.session.activeOrganizationId;
    if (!organizationId) {
      return NextResponse.json(
        { success: false, error: "Organization required" },
        { status: 403 },
      );
    }

    const user = session.user as AuthUser;
    const userRole = getUserRole(user);

    if (!["u1", "u4"].includes(userRole)) {
      return NextResponse.json(
        { success: false, error: "Forbidden - Insufficient permissions" },
        { status: 403 },
      );
    }

    const contact = await prisma.contact.findFirst({
      where: {
        id,
        organizationId,
      },
      include: {
        missionsMember: {
          select: {
            id: true,
            missionNumber: true,
            location: true,
            startDate: true,
            endDate: true,
            status: true,
          },
        },
      },
    });

    if (!contact) {
      return NextResponse.json(
        { success: false, error: "Contact not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error("Error fetching contact:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch contact" },
      { status: 500 },
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
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const organizationId = session.session.activeOrganizationId;
    if (!organizationId) {
      return NextResponse.json(
        { success: false, error: "Organization required" },
        { status: 403 },
      );
    }

    const user = session.user as AuthUser;
    const userRole = getUserRole(user);

    if (!["u1", "u4"].includes(userRole)) {
      return NextResponse.json(
        { success: false, error: "Forbidden - Insufficient permissions" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const validationResult = UpdateContactSchema.safeParse({ ...body, id });

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const validated = validationResult.data;

    // Check if contact exists
    const existing = await prisma.contact.findFirst({
      where: { id, organizationId },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Contact not found" },
        { status: 404 },
      );
    }

    // Check for duplicate email (excluding current contact)
    if (validated.email) {
      const conflict = await prisma.contact.findFirst({
        where: {
          organizationId,
          email: validated.email,
          id: { not: id },
        },
      });

      if (conflict) {
        return NextResponse.json(
          {
            success: false,
            error: "Un contact avec cette adresse email existe déjà",
          },
          { status: 409 },
        );
      }
    }

    const updateData: any = {};
    if (validated.firstName !== undefined)
      updateData.firstName = validated.firstName;
    if (validated.lastName !== undefined)
      updateData.lastName = validated.lastName;
    if (validated.email !== undefined) updateData.email = validated.email;

    const contact = await prisma.contact.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error("Error updating contact:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update contact" },
      { status: 500 },
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
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const organizationId = session.session.activeOrganizationId;
    if (!organizationId) {
      return NextResponse.json(
        { success: false, error: "Organization required" },
        { status: 403 },
      );
    }

    const user = session.user as AuthUser;
    const userRole = getUserRole(user);

    if (!["u1", "u4"].includes(userRole)) {
      return NextResponse.json(
        { success: false, error: "Forbidden - Insufficient permissions" },
        { status: 403 },
      );
    }

    // Check if contact exists and is not used in missions
    const contact = await prisma.contact.findFirst({
      where: { id, organizationId },
      include: {
        missionsMember: { select: { id: true } },
      },
    });

    if (!contact) {
      return NextResponse.json(
        { success: false, error: "Contact not found" },
        { status: 404 },
      );
    }

    if (contact.missionsMember.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Impossible de supprimer ce contact car il est associé à des missions",
        },
        { status: 409 },
      );
    }

    await prisma.contact.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete contact" },
      { status: 500 },
    );
  }
}
