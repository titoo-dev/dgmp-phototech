"use server";

import prisma from "@/lib/prisma";

export async function getProjectAction(id: string) {
  if (!id || typeof id !== 'string') throw new Error("Invalid project id");

  const project = await prisma.project.findUnique({
    where: { id },
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
