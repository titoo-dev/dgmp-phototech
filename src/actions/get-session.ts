"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const getSessionAction = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });
    
    return { session };
  } catch (error) {
    console.error("Get session error:", error);
    return { session: null };
  }
};
