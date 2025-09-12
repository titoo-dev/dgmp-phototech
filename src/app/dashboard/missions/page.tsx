import { getMissionsAction } from '@/actions/mission/get-missions-action';
import { MissionsClient } from '@/components/missions/missions-client';
import { getSessionAction } from '@/actions/get-session';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function MissionsPage() {
	const { session } = await getSessionAction()
	
	if (!session?.user) {
		return redirect('/auth/signin')
	}

	const missionsResult = await getMissionsAction();

	if (!missionsResult.success) {
		throw new Error('Failed to fetch missions');
	}

	return <MissionsClient missions={missionsResult.data} />;
}
