import { getCompaniesAction } from '@/actions/company/get-companies-action';
import ProjectFormClient from '@/components/projects/new/project-form-client';
import { getSessionAction } from '@/actions/get-session';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic'

export default async function NewProjectPage() {
	const { session } = await getSessionAction()
	
	if (!session?.user) {
		return redirect('/auth/signin')
	}

	const companiesResult = await getCompaniesAction();

	return (
		<div className="min-h-screen bg-background">
			<ProjectFormClient companies={companiesResult.companies} />
		</div>
	);
}
