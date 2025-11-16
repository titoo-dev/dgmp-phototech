"use server";

import { auth } from "@/lib/auth";
import { AuthUser } from "@/lib/auth-utils";
import { headers } from "next/headers";

export const getSessionAction = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });
    
    return { session, user: session?.user as AuthUser | null };
  } catch (error) {
    console.error("Get session error:", error);
    return { session: null };
  }
};
