import { redirect } from "next/navigation";
import SignUpClientPage from "../signup-client";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function SignUpWithInvitationPage({
  params,
  searchParams,
}: {
  params: Promise<{ invitationId: string }>;
  searchParams: Promise<{ email?: string }>;
}) {
  const { invitationId } = await params;
  const { email } = await searchParams;

  if (!invitationId) {
    return redirect("/auth/signin");
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpClientPage invitationId={invitationId} email={email} />
    </Suspense>
  );
}
