import { getTeamLeadersAction } from '@/actions/user/get-users-action';
import { getContactsAction } from '@/actions/contact/get-contacts-action';
import MissionFormClient from '@/components/missions/new/mission-form-client';

export default async function NewMissionPage() {
	const [teamLeadersResult, contactsResult] = await Promise.all([
		getTeamLeadersAction(),
		getContactsAction(),
	]);

	return (
		<div className="min-h-screen bg-background">
			<MissionFormClient 
				teamLeaders={teamLeadersResult.users}
				contacts={contactsResult.contacts}
			/>
		</div>
	);
}