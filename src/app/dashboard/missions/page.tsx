import { getMissionsAction } from '@/actions/mission/get-missions-action';
import { MissionsClient } from '@/components/missions/missions-client';
import { getSessionAction } from '@/actions/get-session';
import { redirect } from 'next/navigation';
import { AuthUser, getUserRole } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

export default async function MissionsPage() {
	const { user } = await getSessionAction()

	if (!user) {
		return redirect('/auth/signin')
	}

	const missionsResult = await getMissionsAction();

	if (!missionsResult.success) {
		throw new Error('Failed to fetch missions');
	}

	const userRole = getUserRole(user);

	return (
		<MissionsClient
			missions={missionsResult.data}
			user={user}
			userRole={userRole}
		/>
	);
}
