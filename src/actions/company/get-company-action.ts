"use server";

import prisma from "@/lib/prisma";
import type { Company } from "@/models/company-schema";
import { requireOrganization } from "@/lib/auth-guard";

export async function getCompanyAction(id: string) {
  if (!id || typeof id !== 'string') throw new Error("Invalid company id");

  const { organizationId } = await requireOrganization();

  const company = await prisma.company.findFirst({
    where: {
      id,
      organizationId
    },
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
