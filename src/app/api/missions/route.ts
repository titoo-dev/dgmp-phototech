import { NextResponse } from 'next/server';
import { getMissionsAction } from '@/actions/mission/get-missions-action';

export async function GET() {
  try {
    const result = await getMissionsAction();
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to fetch missions' },
        { status: 500 }
      );
    }

    return NextResponse.json({ missions: result.data });
  } catch (error) {
    console.error('API Error fetching missions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
