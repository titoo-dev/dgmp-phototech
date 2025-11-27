"use server";

import prisma from "@/lib/prisma";
import { requireOrganization } from "@/lib/auth-guard";
import { getUserRole, AuthUser } from "@/lib/auth-utils";

export async function getMissionAction(id: string) {
  if (!id || typeof id !== 'string') throw new Error("Invalid mission id");

  const { session, organizationId, user } = await requireOrganization();

  const userRole = getUserRole(user as AuthUser);

  const mission = await prisma.mission.findFirst({
    where: {
      id,
      organizationId
    },
    include: {
      teamLeader: true,
      members: true,
      missionProjects: {
        include: {
          project: {
            include: {
              company: true,
            },
          },
          files: true,
        },
      },
    },
  });

  if (!mission) throw new Error("Mission not found");

  // Role-based access control
  if (userRole === 'u1' && mission.teamLeaderId !== user.id) {
    throw new Error("Access denied: You can only view your own missions");
  }

  if (userRole === 'u3' && mission.status !== 'COMPLETED') {
    throw new Error("Access denied: You can only view completed missions");
  }

  return mission;
}
