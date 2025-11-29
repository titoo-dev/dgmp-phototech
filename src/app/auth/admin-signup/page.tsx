import { redirect } from "next/navigation";
import AdminSignUpClientPage from "./admin-signup-client";
import { getSessionAction } from "@/actions/get-session";

export const dynamic = "force-dynamic";

export default async function AdminSignUpPage() {
  const { session } = await getSessionAction();

  if (session) {
    return redirect("/");
  }

  if (process.env.ENABLE_ADMIN_SIGNUP !== "true") {
    return redirect("/auth/signin");
  }

  return <AdminSignUpClientPage />;
}

