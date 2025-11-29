import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { AuthUser, getRedirectPath } from "@/lib/auth-utils";

export default async function AuthPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session) {
        const redirectPath = getRedirectPath(session.user as AuthUser);
        redirect(redirectPath);
    }

    redirect("/auth/signin");
}
