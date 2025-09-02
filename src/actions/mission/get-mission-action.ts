"use server";

import prisma from "@/lib/prisma";

export async function getMissionAction(id: string) {
  if (!id || typeof id !== 'string') throw new Error("Invalid mission id");

  const mission = await prisma.mission.findUnique({
    where: { id },
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
