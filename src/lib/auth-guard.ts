import { getSessionAction } from "@/actions/get-session";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const { session, user } = await getSessionAction();

  if (!session || !user) {
    redirect("/auth/signin");
  }

  return { session, user };
}

export async function requireOrganization() {
  const { session, user } = await requireAuth();

  const activeOrganizationId = session?.activeOrganizationId;

  if (!activeOrganizationId) {
    redirect("/dashboard"); // Or a page to select organization
  }

  return {
    session,
    user,
    organizationId: activeOrganizationId
  };
}
