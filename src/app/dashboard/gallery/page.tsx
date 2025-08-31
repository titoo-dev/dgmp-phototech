"use client";

import { Suspense } from 'react';
import PhotoGalleryContent from '@/components/gallery/photo-gallery-content';

export default function PhotoGallery() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<PhotoGalleryContent />
		</Suspense>
	);
}
