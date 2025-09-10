"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserRole, AuthUser } from "@/lib/auth-utils";

export type GalleryPhoto = {
  id: string;
  fileUrl: string;
  metadata: string;
  createdAt: Date;
  missionProject: {
    id: string;
    notes: string;
    project: {
      id: string;
      title: string;
      description: string;
      startDate: Date;
      endDate: Date;
      status: string;
      nature: string;
      company: {
        id: string;
        name: string;
        email: string;
        phoneNumber: string;
      };
    };
    mission: {
      id: string;
      missionNumber: string;
      location: string;
      startDate: Date;
      endDate: Date;
      status: string;
      agentCount: number;
      marketCount: number;
      teamLeader: {
        id: string;
        name: string;
        email: string;
      };
    };
  };
};

export async function getGalleryPhotosAction() {
  // Get current user session for role-based access control
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  const userRole = getUserRole(session.user as AuthUser);

  let whereClause = {};

  // Role-based access control
  if (userRole === 'u1') {
    // Team leaders can only see photos from their missions
    whereClause = {
      missionProject: {
        mission: {
          teamLeaderId: session.user.id
        }
      }
    };
  } else if (userRole === 'u3') {
    // External users can only see photos from completed missions
    whereClause = {
      missionProject: {
        mission: {
          status: 'COMPLETED'
        }
      }
    };
  }
  // u0 and u2 roles can see all photos (no additional where clause)

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
  });

  return photos;
}
