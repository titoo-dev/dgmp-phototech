import { Suspense } from 'react';
import PhotoGalleryContent from '@/components/gallery/photo-gallery-content';
import { getGalleryPhotosAction } from '@/actions/gallery/get-gallery-photos-action';
import { verifyOrganization } from '@/lib/auth-guard';

export const dynamic = 'force-dynamic'

export default async function PhotoGallery() {
	await verifyOrganization();

	const photos = await getGalleryPhotosAction();

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<PhotoGalleryContent photos={photos} />
		</Suspense>
	);
}
