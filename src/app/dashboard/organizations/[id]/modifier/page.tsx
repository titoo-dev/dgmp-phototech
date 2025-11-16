import { redirect } from "next/navigation";
import { getSessionAction } from "@/actions/get-session";
import { getOrganization } from "@/actions/organization/get-organization";
import { getOrganizationInvitations } from "@/actions/organization/get-organization-invitations";
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

  const [orgResult, invitationsResult] = await Promise.all([
    getOrganization(id),
    getOrganizationInvitations(id),
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

  const invitations = invitationsResult.success && invitationsResult.data ? invitationsResult.data : [];

  return (
    <EditOrganizationClient
      organization={orgResult.data}
      initialInvitations={invitations}
    />
  );
};

export default EditOrganizationPage;
