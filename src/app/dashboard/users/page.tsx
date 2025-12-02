import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  UserPlus
} from "lucide-react"
import Link from "next/link"
import { listUsersWithRoleFilterAction, type ListUsersParams } from "@/actions/user/get-users-action"
import { UsersClient } from "./users-client"
import { verifyOrganization } from "@/lib/auth-guard"
import { UserRole } from "@/lib/auth-utils"
import { getOrganizationInvitations } from "@/actions/organization/get-organization-invitations"

export const dynamic = 'force-dynamic'

interface UtilisateursPageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    role?: string
    status?: string
  }>
}

export default async function UtilisateursPage({ searchParams }: UtilisateursPageProps) {
  const { user, activeOrganizationId } = await verifyOrganization();
  
  const params = await searchParams
  const page = parseInt(params.page || "1")
  const limit = 10
  const offset = (page - 1) * limit

  const paramsValues: ListUsersParams = {
    searchValue: params.search,
    searchField: "name",
    limit,
    offset,
    sortBy: "name",
    sortDirection: "asc",
    role: params.role,
    status: params.status,
    organizationId: activeOrganizationId ?? undefined,
  }

  const [result, invitationsResult] = await Promise.all([
    listUsersWithRoleFilterAction(paramsValues),
    activeOrganizationId ? getOrganizationInvitations(activeOrganizationId) : Promise.resolve({ success: false, data: [] })
  ])
  
  if (result.error) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="text-center py-8">
          <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Erreur de chargement</h3>
          <p className="text-muted-foreground">{result.error}</p>
        </div>
      </div>
    )
  }

  const users = result.users || []
  const total = result.total || 0
  const totalPages = Math.ceil(total / limit)
  const invitations = invitationsResult.data || []

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
          <p className="text-muted-foreground">
            Gérez les utilisateurs et leurs permissions
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/users/new">
            <UserPlus className="w-4 h-4 mr-2" />
            Inviter un utilisateur
          </Link>
        </Button>
      </div>

      <Suspense fallback={<div>Chargement...</div>}>
        <UsersClient 
          users={users}
          total={total}
          currentPage={page}
          totalPages={totalPages}
          searchParams={params}
          userRole={user.role as UserRole}
          invitations={invitations}
        />
      </Suspense>
    </div>
  )
}
