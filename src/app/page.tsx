import { getSessionAction } from "@/actions/get-session";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { session } = await getSessionAction();

  console.log('session', session);

  if (!session) {
    return redirect("/auth/signin");
  }

  return redirect("/dashboard");
};

