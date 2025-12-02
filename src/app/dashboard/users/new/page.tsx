import NewUserClient from "./new-user-client"
import { verifyOrganization } from "@/lib/auth-guard";
import { UserRole } from "@/lib/auth-utils";

export const dynamic = 'force-dynamic'

export default async function NewUserPage() {
  const { user, activeOrganizationId } = await verifyOrganization();
  
  if (!activeOrganizationId) {
    throw new Error("Aucune organisation active");
  }
  
  return <NewUserClient organizationId={activeOrganizationId} userRole={user.role as UserRole} />
}
