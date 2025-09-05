"use server";

import prisma from "@/lib/prisma";
import type { Company } from "@/models/company-schema";

export async function getCompanyAction(id: string) {
  if (!id || typeof id !== 'string') throw new Error("Invalid company id");

  const company = await prisma.company.findUnique({
    where: { id },
    include: {
      projects: {
        select: {
          id: true,
          title: true,
          description: true,
          startDate: true,
          endDate: true,
          status: true,
          nature: true,
        },
      },
    },
  });

  if (!company) throw new Error("Company not found");

  return company;
}
