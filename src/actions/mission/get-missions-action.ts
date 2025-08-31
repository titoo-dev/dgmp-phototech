"use server";

import prisma from "@/lib/prisma";
import { Mission } from "@/lib/generated/prisma";

export async function getMissionsAction(): Promise<
  | { success: true; data: Mission[] }
  | { success: false; error: string; data?: undefined }
> {
  try {
    const missions = await prisma.mission.findMany({
      include: {
        teamLeader: true,
        members: true,
      },
      orderBy: {
        startDate: "desc",
      },
    });

    return {
      success: true,
      data: missions,
    };
  } catch (error) {
    console.error("Failed to fetch missions:", error);
    return {
      success: false,
      error: "Failed to fetch missions",
    };
  }
}
