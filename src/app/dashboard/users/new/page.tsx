import NewUserClient from "./new-user-client"
import { verifyOrganization } from "@/lib/auth-guard";

export const dynamic = 'force-dynamic'

export default async function NewUserPage() {
  await verifyOrganization();
  return <NewUserClient />
}
