"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const signOutAction = async () => {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
    
    return { success: true, redirect: "/" };
  } catch (error) {
    console.error("Sign out error:", error);
    return { success: false, error: "Failed to sign out" };
  }
};
