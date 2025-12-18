import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const w = searchParams.get('w') || '600';
    const h = searchParams.get('h') || '400';
    const center = searchParams.get('center'); // "lon,lat"
    const level = searchParams.get('level') || '16';
    const markers = searchParams.get('markers');

    if (!center) {
        return NextResponse.json({ error: 'Center parameter is required' }, { status: 400 });
    }

    const apiUrl = `https://maps.apigw.ntruss.com/map-static/v2/raster?w=${w}&h=${h}&center=${center}&level=${level}&markers=${markers || ''}&scale=2`;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                'X-NCP-APIGW-API-KEY-ID': process.env.X_NCP_APIGW_API_KEY_ID,
                'X-NCP-APIGW-API-KEY': process.env.X_NCP_APIGW_API_KEY,
            },
        });

        if (!response.ok) {
            console.error('Naver Map API Error:', response.status, response.statusText);
            return NextResponse.json({ error: 'Failed to fetch map' }, { status: response.status });
        }

        const buffer = await response.arrayBuffer();
        const headers = new Headers();
        headers.set('Content-Type', 'image/png');
        headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600');

        return new NextResponse(buffer, {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error('Static Map Proxy Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
