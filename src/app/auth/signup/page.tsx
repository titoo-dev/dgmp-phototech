import { redirect } from "next/navigation";
import SignUpClientPage from "./signup-client";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ invitationId?: string; email?: string }>;
}) {
  const params = await searchParams;
  
  if (process.env.DISABLE_SIGN_UP === "false" && !params.invitationId) {
    return redirect("/auth/signin");
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpClientPage />
    </Suspense>
  );
}
