import { getCompaniesAction } from '@/actions/company/get-companies-action';
import ProjectFormClient from '@/components/projects/new/project-form-client';

export default async function NewProjectPage() {
	const companiesResult = await getCompaniesAction();

	return (
		<div className="min-h-screen bg-background">
			<ProjectFormClient companies={companiesResult.companies} />
		</div>
	);
}
