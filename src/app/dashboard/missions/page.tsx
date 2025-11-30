import { getMissionsAction } from '@/actions/mission/get-missions-action';
import { MissionsClient } from '@/components/missions/missions-client';
import { getUserRole } from '@/lib/auth-utils';
import { verifyOrganization } from '@/lib/auth-guard';

export const dynamic = 'force-dynamic';

export default async function MissionsPage() {
	const { user } = await verifyOrganization();

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
