import { getSessionAction } from "@/actions/get-session";
import { redirect, unauthorized } from "next/navigation";
import { auth } from "./auth";
import { headers } from "next/headers";
import { AuthUser } from "./auth-utils";


export async function verifySession({ withRedirect }: { withRedirect?: boolean } = {}) {
  const result = await auth.api.getSession({
    headers: await headers(),
  })

  if (!result && withRedirect) {
    redirect("/auth/signin");
  }

  if (!result) {
    unauthorized();
  }

  if (!result.user.emailVerified) {
    redirect("/auth/verify-email");
  }

  if (!result.user.role) {
    redirect("/auth/signin");
  }

  const { session, user } = result;

  return {
    success: true,
    userId: user.id,
    user: user as AuthUser,
    activeOrganizationId: session.activeOrganizationId,
  }
}

export async function verifyOrganization() {

  const session = await verifySession();

  if (session.user.role !== "u5" && !session.activeOrganizationId) {
    const organizations = await auth.api.listOrganizations({
      headers: await headers(),
    });

    console.log("USER ORGANIZATIONS", organizations);

    if (organizations?.length && organizations.length > 0) {
      await auth.api.setActiveOrganization({
        headers: await headers(),
        body: {
          organizationId: organizations[0].id,
        },
      });
    } else {
      unauthorized();
    }
  }

  return {
    success: true,
    activeOrganizationId: session.activeOrganizationId,
    user: session.user as AuthUser,
  }
}


export async function verifyU1Session() {
  const session = await verifySession();
  if (session.user.role !== "u1") {
      unauthorized();
  }
}

export async function verifyU2Session() {
  const session = await verifySession();
  if (session.user.role !== "u2") {
      unauthorized();
  }
}

export async function verifyU3Session() {
  const session = await verifySession();
  if (session.user.role !== "u3") {
      unauthorized();
  }
}

export async function verifyU4Session() {
  const session = await verifySession();
  if (session.user.role !== "u4") {
      unauthorized();
  }
}

export async function verifyU5Session() {
  const session = await verifySession();
  if (session.user.role !== "u5") {
      unauthorized();
  }
}



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
