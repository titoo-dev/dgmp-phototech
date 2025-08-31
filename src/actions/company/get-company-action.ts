"use server";

import prisma from "@/lib/prisma";

export async function getCompanyAction(id: string) {
  if (!id || typeof id !== 'string') throw new Error("Invalid company id");

  const company = await prisma.company.findUnique({
    where: { id },
  });

  if (!company) throw new Error("Company not found");

  return company;
}
