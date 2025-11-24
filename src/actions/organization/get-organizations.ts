"use server";

import prisma from "@/lib/prisma";
import { getSessionAction } from "@/actions/get-session";

export const getOrganizations = async (searchParams?: {
  search?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const { session, user } = await getSessionAction();

    if (!session || !user) {
      return {
        success: false,
        error: "Vous devez être connecté pour voir les organisations",
      };
    }

    if (user.role !== "u5") {
      return {
        success: false,
        error: "Vous n'avez pas les permissions nécessaires pour voir les organisations",
      };
    }

    const page = searchParams?.page || 1;
    const limit = searchParams?.limit || 10;
    const search = searchParams?.search || "";

    const where = search
      ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { slug: { contains: search, mode: "insensitive" as const } },
        ],
      }
      : {};

    const total = await prisma.organization.count({ where });

    const organizations = await prisma.organization.findMany({
      where,
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Transform members to add id field (composite key as string)
    const transformedOrganizations = organizations.map(org => ({
      ...org,
      members: org.members.map(member => ({
        ...member,
        id: `${member.organizationId}-${member.userId}`,
      })),
    }));

    return {
      success: true,
      data: {
        organizations: transformedOrganizations,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error("Error getting organizations:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la récupération des organisations",
    };
  }
};
