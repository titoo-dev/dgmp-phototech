import { getMissionsAction } from '@/actions/mission/get-missions-action';
import { MissionsClient } from '@/components/missions/missions-client';

export const dynamic = 'force-dynamic';

export default async function MissionsPage() {
	const missionsResult = await getMissionsAction();

	if (!missionsResult.success) {
		throw new Error('Failed to fetch missions');
	}

	return <MissionsClient missions={missionsResult.data} />;
}
