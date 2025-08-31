import { getSessionAction } from "@/actions/get-session";
import { AuthUser, getRedirectPath } from "@/lib/auth-utils";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { session } = await getSessionAction();

  console.log('session', session);

  if (!session) {
    return redirect("/auth/signin");
  }

  if (!session.user.emailVerified) {
    redirect("/auth/verify-email");
  }

  const redirectPath = getRedirectPath(session.user as AuthUser);
  redirect(redirectPath);
};

