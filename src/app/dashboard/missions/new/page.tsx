import { getTeamLeadersAction } from '@/actions/user/get-users-action';
import { getContactsAction } from '@/actions/contact/get-contacts-action';
import { getProjectsAction } from '@/actions/project/get-projects-action';
import MissionFormClient from '@/components/missions/new/mission-form-client';

export default async function NewMissionPage() {
	const [teamLeadersResult, contactsResult, projectsResult] = await Promise.all([
		getTeamLeadersAction(),
		getContactsAction(),
		getProjectsAction(),
	]);

	if (!projectsResult.success) {
		throw new Error('Failed to fetch projects');
	}

	return (
		<div className="min-h-screen bg-background">
			<MissionFormClient 
				teamLeaders={teamLeadersResult.users}
				contacts={contactsResult.contacts}
				projects={projectsResult.data}
			/>
		</div>
	);
}