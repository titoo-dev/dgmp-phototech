import { redirect } from "next/navigation";
import { getSessionAction } from "@/actions/get-session";
import { getOrganization } from "@/actions/organization/get-organization";
import { getAvailableAdmins } from "@/actions/organization/get-available-admins";
import { EditOrganizationClient } from "./edit-organization-client";

const EditOrganizationPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { session, user } = await getSessionAction();

  if (!session || !user) {
    redirect("/auth/signin");
  }

  
  // Only u5 (super admin) can edit organizations
  if (user.role !== "u5") {
    redirect("/dashboard");
  }

  const { id } = await params;

  const [orgResult, adminsResult] = await Promise.all([
    getOrganization(id),
    getAvailableAdmins(),
  ]);

  if (!orgResult.success || !orgResult.data) {
    return (
      <div className="p-8">
        <p className="text-red-500">
          {orgResult.error || "Erreur lors du chargement de l'organisation"}
        </p>
      </div>
    );
  }

  const availableAdmins = adminsResult.success && adminsResult.data ? adminsResult.data : [];

  return (
    <EditOrganizationClient
      organization={orgResult.data}
      availableAdmins={availableAdmins}
    />
  );
};

export default EditOrganizationPage;
