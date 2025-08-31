import { list } from '@vercel/blob';
import { NextResponse } from "next/server";

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
