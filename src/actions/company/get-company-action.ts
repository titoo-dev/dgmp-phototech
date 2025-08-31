"use server";

import prisma from "@/lib/prisma";
import type { Company } from "@/models/company-schema";

export async function getCompanyAction(id: string): Promise<Company> {
  if (!id || typeof id !== 'string') throw new Error("Invalid company id");

  const company = await prisma.company.findUnique({
    where: { id },
    include: {
      projects: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!company) throw new Error("Company not found");

  // Transform to match Company schema with projects count
  return {
    id: company.id,
    name: company.name,
    email: company.email,
    phoneNumber: company.phoneNumber,
    nif: company.nif,
    employeeCount: company.employeeCount,
    projectsCount: company.projects.length,
  };
}
