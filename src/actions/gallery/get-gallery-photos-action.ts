"use server";

import prisma from "@/lib/prisma";
import { requireOrganization } from "@/lib/auth-guard";
import { getUserRole } from "@/lib/auth-utils";
import { MissionStatus, Prisma } from "@/lib/generated/prisma";

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
  const { user, organizationId } = await requireOrganization();
  const userRole = getUserRole(user);

  const whereClause: Prisma.MissionFileWhereInput = {
    missionProject: {
      mission: {
        organizationId,
        ...(userRole === 'u1' && { teamLeaderId: user.id }),
        ...(userRole === 'u3' && { status: MissionStatus.COMPLETED }),
      }
    }
  };

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
