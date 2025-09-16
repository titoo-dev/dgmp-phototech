import { del, head, put } from '@vercel/blob';
import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/image:
 *   post:
 *     tags:
 *       - Images
 *     summary: Upload an image file
 *     description: |
 *       Upload an image file to Vercel Blob storage. 
 *       Only image files are allowed (JPEG, PNG, GIF, etc.).
 *       Returns the URL and metadata of the uploaded file.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FileUploadResponse'
 *       400:
 *         description: Bad request - no file or invalid file type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Upload failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     tags:
 *       - Images
 *     summary: Delete an image file
 *     description: Delete an image file from Vercel Blob storage using its URL.
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         description: URL of the file to delete
 *         schema:
 *           type: string
 *           format: uri
 *           example: "https://blob.vercel-storage.com/report-abc123.jpg"
 *     responses:
 *       200:
 *         description: File deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *       400:
 *         description: Bad request - no URL provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Delete failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   get:
 *     tags:
 *       - Images
 *     summary: Get image file metadata
 *     description: Get metadata information about an image file using its URL.
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         description: URL of the file to get metadata for
 *         schema:
 *           type: string
 *           format: uri
 *           example: "https://blob.vercel-storage.com/report-abc123.jpg"
 *     responses:
 *       200:
 *         description: Metadata retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 url:
 *                   type: string
 *                   format: uri
 *                   example: "https://blob.vercel-storage.com/report-abc123.jpg"
 *                 pathname:
 *                   type: string
 *                   example: "report-abc123.jpg"
 *                 contentType:
 *                   type: string
 *                   example: "image/jpeg"
 *                 contentLength:
 *                   type: integer
 *                   example: 1024000
 *                 size:
 *                   type: integer
 *                   example: 1024000
 *                 uploadedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-01T00:00:00Z"
 *       400:
 *         description: Bad request - no URL provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Failed to get metadata
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

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
