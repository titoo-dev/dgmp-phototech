import { redirect } from "next/navigation";
import { getSessionAction } from "@/actions/get-session";
import { getOrganizations } from "@/actions/organization/get-organizations";
import { OrganizationsClient } from "./organizations-client";

const OrganizationsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { session, user } = await getSessionAction();

  if (!session || !user) {
    redirect("/auth/signin");
  }

  // Only u5 (super admin) can access organizations
  if (user.role !== "u5") {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : "";
  const page = typeof params.page === "string" ? Number.parseInt(params.page) : 1;

  const result = await getOrganizations({
    search,
    page,
    limit: 10,
  });

  if (!result.success || !result.data) {
    return (
      <div className="p-8">
        <p className="text-red-500">{result.error || "Erreur lors du chargement des organisations"}</p>
      </div>
    );
  }

  return (
    <OrganizationsClient
      initialOrganizations={result.data.organizations}
      initialPagination={result.data.pagination}
    />
  );
};

export default OrganizationsPage;
