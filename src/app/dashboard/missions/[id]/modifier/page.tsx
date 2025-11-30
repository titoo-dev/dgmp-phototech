import { getMissionAction } from '@/actions/mission/get-mission-action';
import { getContactsAction } from '@/actions/contact/get-contacts-action';
import { getProjectsAction } from '@/actions/project/get-projects-action';
import UpdateMissionFormClient from '@/components/missions/update/update-mission-form-client';
import { verifyOrganization } from '@/lib/auth-guard';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function UpdateMissionPage(props: Props) {
  await verifyOrganization();
  const { params } = props;
  const { id } = await params;

  const [missionResult, contactsResult, projectsResult] = await Promise.all([
    getMissionAction(id),
    getContactsAction(),
    getProjectsAction(),
  ]);

  if (!projectsResult.success) {
    throw new Error('Failed to fetch projects');
  }

  return (
    <div className="min-h-screen bg-background">
      <UpdateMissionFormClient 
        mission={missionResult}
        contacts={contactsResult.contacts}
        projects={projectsResult.data}
      />
    </div>
  );
}
