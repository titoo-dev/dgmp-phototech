import { getTeamLeadersAction } from '@/actions/user/get-users-action';
import { getContactsAction } from '@/actions/contact/get-contacts-action';
import { getProjectsAction } from '@/actions/project/get-projects-action';
import { getSessionAction } from '@/actions/get-session';
import { UserModel } from '@/models/user-schema';
import MissionFormClient from '@/components/missions/new/mission-form-client';

export default async function NewMissionPage() {
	const [teamLeadersResult, contactsResult, projectsResult, sessionResult] = await Promise.all([
		getTeamLeadersAction(),
		getContactsAction(),
		getProjectsAction(),
		getSessionAction(),
	]);

	if (!projectsResult.success) {
		throw new Error('Failed to fetch projects');
	}

	if (!sessionResult.session?.user) {
		throw new Error('User not authenticated');
	}

	return (
		<div className="min-h-screen bg-background">
			<MissionFormClient 
				teamLeaders={teamLeadersResult.users}
				contacts={contactsResult.contacts}
				projects={projectsResult.data}
				currentUser={sessionResult.session.user as UserModel}
			/>
		</div>
	);
}