"use server";

import prisma from "@/lib/prisma";
import { requireOrganization } from "@/lib/auth-guard";

export async function getProjectAction(id: string) {
  if (!id || typeof id !== 'string') throw new Error("Invalid project id");

  const { organizationId } = await requireOrganization();

  const project = await prisma.project.findFirst({
    where: {
      id,
      organizationId
    },
    include: {
      company: true,
      missionProjects: {
        include: {
          mission: {
            include: {
              teamLeader: true,
            },
          },
        },
      },
    },
  });

  if (!project) throw new Error("Project not found");

  return project;
}
