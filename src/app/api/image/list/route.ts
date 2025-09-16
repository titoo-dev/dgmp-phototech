import { list } from '@vercel/blob';
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/image/list:
 *   get:
 *     tags:
 *       - Images
 *     summary: List uploaded images
 *     description: |
 *       List all uploaded images from Vercel Blob storage with pagination support.
 *       Returns a list of image URLs with metadata.
 *     parameters:
 *       - in: query
 *         name: cursor
 *         required: false
 *         description: Pagination cursor for getting next page of results
 *         schema:
 *           type: string
 *           example: "cursor-abc123"
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Maximum number of images to return (default varies by storage provider)
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 1000
 *           example: 50
 *     responses:
 *       200:
 *         description: Images listed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImageListResponse'
 *       500:
 *         description: Failed to list images
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const cursor = searchParams.get('cursor');
		const limit = searchParams.get('limit');

		const options: { cursor?: string; limit?: number } = {};
		if (cursor) options.cursor = cursor;
		if (limit) options.limit = parseInt(limit);

		const result = await list(options);

		return NextResponse.json({
			success: true,
			...result,
		});
	} catch (error) {
		console.error('List blobs error:', error);
		return NextResponse.json(
			{ error: 'Failed to list blobs' },
			{ status: 500 }
		);
	}
}
