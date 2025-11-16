import { redirect } from "next/navigation";
import { getSessionAction } from "@/actions/get-session";
import { NewOrganizationClient } from "./new-organization-client";

const NewOrganizationPage = async () => {
  const { session, user } = await getSessionAction();

  if (!session || !user) {
    redirect("/auth/signin");
  }

  // Only u5 (super admin) can create organizations
  if (user.role !== "u5") {
    redirect("/dashboard");
  }

  return <NewOrganizationClient />;
};

export default NewOrganizationPage;
