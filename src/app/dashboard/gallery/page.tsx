import { Suspense } from 'react';
import PhotoGalleryContent from '@/components/gallery/photo-gallery-content';
import { getGalleryPhotosAction } from '@/actions/gallery/get-gallery-photos-action';

export default async function PhotoGallery() {
	const photos = await getGalleryPhotosAction();

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<PhotoGalleryContent photos={photos} />
		</Suspense>
	);
}
