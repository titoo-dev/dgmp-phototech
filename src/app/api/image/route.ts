import { del, head, put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	try {
		const formData = await req.formData();
		const file = formData.get('file') as File | null;

		if (!file) {
			return NextResponse.json(
				{ error: 'No file uploaded' },
				{ status: 400 }
			);
		}

		// Validate file type (images only)
		if (!file.type.startsWith('image/')) {
			return NextResponse.json(
				{ error: 'Only image files are allowed' },
				{ status: 400 }
			);
		}

		// Generate a unique filename
		const fileExtension = file.name.split('.').pop() || 'jpg';
		const filename = `report.${fileExtension}`;

		// Upload to Vercel Blob
		const blob = await put(filename, file, {
			access: 'public',
			addRandomSuffix: true,
			multipart: true,
		});

		return NextResponse.json({
			success: true,
			filename: blob.pathname,
			size: file.size,
			type: file.type,
			...blob,
		});
	} catch (error) {
		console.error('Upload error:', error);
		return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
	}
}

export async function DELETE(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const url = searchParams.get('url');

		if (!url) {
			return NextResponse.json(
				{ error: 'No URL provided' },
				{ status: 400 }
			);
		}

		// Delete from Vercel Blob
		await del(url);

		return NextResponse.json({
			success: true,
			message: 'File deleted successfully',
		});
	} catch (error) {
		console.error('Delete error:', error);
		return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
	}
}

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const url = searchParams.get('url');

		if (!url) {
			return NextResponse.json(
				{ error: 'No URL provided' },
				{ status: 400 }
			);
		}

		const blob = await head(url);

		return NextResponse.json({
			success: true,
			...blob,
		});
	} catch (error) {
		console.error('Get metadata error:', error);
		return NextResponse.json(
			{ error: 'Failed to get metadata' },
			{ status: 500 }
		);
	}
}
