import { NextResponse } from 'next/server';
import { getBlocks } from '../../../../lib/notion';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId');

    if (!pageId) {
        return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
    }

    try {
        const blocks = await getBlocks(pageId);
        return NextResponse.json({ blocks });
    } catch (error) {
        console.error('Error fetching page blocks:', error);
        return NextResponse.json(
            { error: 'Failed to fetch blocks', details: error.message },
            { status: 500 }
        );
    }
}
