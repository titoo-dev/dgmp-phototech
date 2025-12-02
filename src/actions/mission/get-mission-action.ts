"use server";

import prisma from "@/lib/prisma";
import { requireOrganization } from "@/lib/auth-guard";

export async function getMissionAction(id: string) {
  if (!id || typeof id !== 'string') throw new Error("Invalid mission id");

  const { organizationId } = await requireOrganization();

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

  return mission;
}
