import { getSessionAction } from "@/actions/get-session"
import { redirect } from "next/navigation"
import NewUserClient from "./new-user-client"

export const dynamic = 'force-dynamic'

export default async function NewUserPage() {
  const { user } = await getSessionAction()

  if (!user) {
    return redirect('/auth/signin')
  }

  return <NewUserClient />
}
