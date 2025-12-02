import { getMissionsAction } from '@/actions/mission/get-missions-action';
import { MissionsClient } from '@/components/missions/missions-client';
import { getUserRole } from '@/lib/auth-utils';
import { verifyOrganization } from '@/lib/auth-guard';

export const dynamic = 'force-dynamic';

export default async function MissionsPage() {
	const { user } = await verifyOrganization();
	const userRole = getUserRole(user);

	const missionsResult = await getMissionsAction(userRole);

	if (!missionsResult.success) {
		throw new Error('Failed to fetch missions');
	}

	return (
		<MissionsClient
			missions={missionsResult.data}
			user={user}
			userRole={userRole}
		/>
	);
}
