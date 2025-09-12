import { getProjectsAction } from '@/actions/project/get-projects-action';
import { ProjectsClient } from '@/components/projects/projects-client';
import { getSessionAction } from '@/actions/get-session';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic'

export default async function ProjetsPage() {
	const { session } = await getSessionAction()
	
	if (!session?.user) {
		return redirect('/auth/signin')
	}

	const result = await getProjectsAction();

	if (!result.success || !result.data) {
		return (
			<div className="container mx-auto p-6">
				<div className="text-center py-12">
					<h2 className="text-xl font-semibold text-red-600 mb-2">
						Error loading projects
					</h2>
					<p className="text-gray-600">
						{result.error || 'An unexpected error occurred'}
					</p>
				</div>
			</div>
		);
	}

	return <ProjectsClient projects={result.data} />;
}
