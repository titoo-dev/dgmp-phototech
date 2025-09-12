import { Suspense } from 'react';
import PhotoGalleryContent from '@/components/gallery/photo-gallery-content';
import { getGalleryPhotosAction } from '@/actions/gallery/get-gallery-photos-action';
import { getSessionAction } from '@/actions/get-session';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic'

export default async function PhotoGallery() {
	const { session } = await getSessionAction()
	
	if (!session?.user) {
		return redirect('/auth/signin')
	}

	const photos = await getGalleryPhotosAction();

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<PhotoGalleryContent photos={photos} />
		</Suspense>
	);
}
