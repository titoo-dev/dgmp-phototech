import { getMissionAction } from '@/actions/mission/get-mission-action';
import { getTeamLeadersAction } from '@/actions/user/get-users-action';
import { getContactsAction } from '@/actions/contact/get-contacts-action';
import { getProjectsAction } from '@/actions/project/get-projects-action';
import UpdateMissionFormClient from '@/components/missions/update/update-mission-form-client';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function UpdateMissionPage(props: Props) {
  const { params } = props;
  const { id } = await params;

  const [missionResult, teamLeadersResult, contactsResult, projectsResult] = await Promise.all([
    getMissionAction(id),
    getTeamLeadersAction(),
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
        teamLeaders={teamLeadersResult.users}
        contacts={contactsResult.contacts}
        projects={projectsResult.data}
      />
    </div>
  );
}
