/**
 * User API Routes - Single Resource
 *
 * GET /api/users/:id - Get a single user
 * PUT /api/users/:id - Update user (currently supports role update)
 * DELETE /api/users/:id - Remove user from organization
 *
 * Roles: u2, u4 can access
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserRole, type AuthUser } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { z } from "zod";

const UpdateUserSchema = z.object({
  role: z.enum(["u1", "u2", "u3"]).optional(),
  name: z.string().min(1).optional(),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
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

    const currentUser = session.user as AuthUser;
    const currentUserRole = getUserRole(currentUser);

    if (!["u2", "u4"].includes(currentUserRole)) {
      return NextResponse.json(
        { success: false, error: "Forbidden - Insufficient permissions" },
        { status: 403 },
      );
    }

    const { id } = await params;

    // Get user with their membership info
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        banned: true,
        banReason: true,
        banExpires: true,
        createdAt: true,
        image: true,
        members: {
          where: { organizationId },
          select: {
            id: true,
            role: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    // Check if user is member of the organization
    if (user.members.length === 0) {
      return NextResponse.json(
        { success: false, error: "User is not a member of this organization" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...user,
        membership: user.members[0],
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
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

    const currentUser = session.user as AuthUser;
    const currentUserRole = getUserRole(currentUser);

    if (!["u2", "u4"].includes(currentUserRole)) {
      return NextResponse.json(
        { success: false, error: "Forbidden - Insufficient permissions" },
        { status: 403 },
      );
    }

    const { id } = await params;
    const body = await request.json();

    const validationResult = UpdateUserSchema.safeParse(body);

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

    const { role, name } = validationResult.data;

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
        { success: false, error: "User not found in this organization" },
        { status: 404 },
      );
    }

    // Update role via Better Auth if provided
    if (role) {
      await auth.api.setRole({
        body: { userId: id, role },
        headers: request.headers,
      });
    }

    // Update name if provided
    if (name) {
      await prisma.user.update({
        where: { id },
        data: { name },
      });
    }

    // Fetch updated user
    const updatedUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        banned: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 },
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

    const currentUser = session.user as AuthUser;
    const currentUserRole = getUserRole(currentUser);

    // Only u4 can remove users
    if (currentUserRole !== "u4") {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden - Only administrators can remove users",
        },
        { status: 403 },
      );
    }

    const { id } = await params;

    // Prevent self-removal
    if (id === currentUser.id) {
      return NextResponse.json(
        { success: false, error: "Vous ne pouvez pas vous retirer vous-même" },
        { status: 400 },
      );
    }

    // Check if user is member of org
    const member = await prisma.member.findFirst({
      where: {
        userId: id,
        organizationId,
      },
    });

    if (!member) {
      return NextResponse.json(
        { success: false, error: "User not found in this organization" },
        { status: 404 },
      );
    }

    // Remove member from organization
    await auth.api.removeMember({
      body: {
        memberIdOrEmail: id,
        organizationId,
      },
      headers: request.headers,
    });

    return NextResponse.json({
      success: true,
      message: "User removed from organization",
    });
  } catch (error) {
    console.error("Error removing user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove user" },
      { status: 500 },
    );
  }
}
