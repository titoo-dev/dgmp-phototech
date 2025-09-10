"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserRole, AuthUser } from "@/lib/auth-utils";

export async function getMissionAction(id: string) {
  if (!id || typeof id !== 'string') throw new Error("Invalid mission id");

  // Get current user session for role-based access control
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  const userRole = getUserRole(session.user as AuthUser);

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

  // Role-based access control: u1 users can only access their own missions
  if (userRole === 'u1' && mission.teamLeaderId !== session.user.id) {
    throw new Error("Access denied: You can only view your own missions");
  }

  return mission;
}
