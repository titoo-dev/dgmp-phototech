import { getProjectAction } from '@/actions/project/get-project-action';
import { getCompaniesAction } from '@/actions/company/get-companies-action';
import UpdateProjectFormClient from '@/components/projects/update/update-project-form-client';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function UpdateProjectPage(props: Props) {
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
