import { getCompaniesAction } from '@/actions/company/get-companies-action';
import ProjectFormClient from '@/components/projects/new/project-form-client';
import { verifyOrganization } from '@/lib/auth-guard';

export const dynamic = 'force-dynamic'

export default async function NewProjectPage() {
	await verifyOrganization();

	const companiesResult = await getCompaniesAction();

	return (
		<div className="min-h-screen bg-background">
			<ProjectFormClient companies={companiesResult.companies} />
		</div>
	);
}
