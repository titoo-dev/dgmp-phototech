import { getProjectAction } from '@/actions/project/get-project-action';
import { getCompaniesAction } from '@/actions/company/get-companies-action';
import UpdateProjectFormClient from '@/components/projects/update/update-project-form-client';
import { getSessionAction } from '@/actions/get-session';
import { redirect } from 'next/navigation';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function UpdateProjectPage(props: Props) {
  const { session } = await getSessionAction()
  
  if (!session?.user) {
    return redirect('/auth/signin')
  }
  
  const { params } = props;
  const { id } = await params;

  const [project, companiesResult] = await Promise.all([
    getProjectAction(id),
    getCompaniesAction(),
  ]);

  if (companiesResult.error) {
    throw new Error('Failed to fetch companies');
  }

  return (
    <div className="min-h-screen bg-background">
      <UpdateProjectFormClient 
        project={project}
        companies={companiesResult.companies}
      />
    </div>
  );
}
