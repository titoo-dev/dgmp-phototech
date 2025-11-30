import NewUserClient from "./new-user-client"
import { verifyOrganization } from "@/lib/auth-guard";

export const dynamic = 'force-dynamic'

export default async function NewUserPage() {
  const { activeOrganizationId } = await verifyOrganization();
  
  if (!activeOrganizationId) {
    throw new Error("Aucune organisation active");
  }
  
  return <NewUserClient organizationId={activeOrganizationId} />
}
