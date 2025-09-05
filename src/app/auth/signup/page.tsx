import { redirect } from "next/navigation";
import SignUpClientPage from "./signup-client";

export const dynamic = "force-dynamic";

export default async function SignUpPage() {
  if (process.env.DISABLE_SIGN_UP === "false") {
    return redirect("/auth/signin");
  }

  return <SignUpClientPage />;
}
