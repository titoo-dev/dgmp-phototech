import { getRedirectPath } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth-guard";

export default async function HomePage() {
  const sessionResult = await verifySession({ withRedirect: true });

  const redirectPath = getRedirectPath(sessionResult.user);

  redirect(redirectPath);
}

