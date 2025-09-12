import { getSessionAction } from "@/actions/get-session"
import { redirect } from "next/navigation"
import NewUserClient from "./new-user-client"

export default async function NewUserPage() {
  const { session } = await getSessionAction()
  
  if (!session?.user) {
    return redirect('/auth/signin')
  }

  return <NewUserClient />
}
