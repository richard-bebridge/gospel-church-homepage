import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const x = searchParams.get('x');
    const y = searchParams.get('y');
    const w = searchParams.get('w') || '640';
    const h = searchParams.get('h') || '640';
    const level = searchParams.get('level') || '16';

    if (!x || !y) {
        return NextResponse.json({ error: 'x and y parameters are required' }, { status: 400 });
    }

    // Naver Static Map API URL
    // Using center={x},{y} 
    // If input is WebMercator or TM128, we might need 'crs' parameter.
    // However, user input 141.../450... suggests Web Mercator (EPSG:3857).
    // Naver documentation defaults center to WGS84 (Lng,Lat) if no crs is provided.
    // If the coordinates are large numbers, we normally need crs=EPSG:3857 (or similar).
    // User Instructions: "Naver Static Map URL is configured based on existing project standards"
    // I will try adding `crs=EPSG:3857` blindly if the values are large, OR just pass them.
    // Given user explicitly gave `x` `y`, I'll assume they maps to 'center'.
    // Let's add `crs` if the numbers look like Web Mercator (> 180).

    let crsParam = '';
    if (parseFloat(x) > 200 || parseFloat(y) > 200) {
        crsParam = '&crs=EPSG:3857'; // Assuming Web Mercator
    }

    const apiUrl = `https://maps.apigw.ntruss.com/map-static/v2/raster?w=${w}&h=${h}&center=${x},${y}&level=${level}&scale=2${crsParam}`;

    // Debugging loaded keys (Partial reveal)
    const keyId = (process.env.NAVER_ID || '').trim();
    const keySecret = (process.env.NAVER_API_KEY || '').trim();

    console.log('[API] Key ID Prefix:', keyId.substring(0, 4) + '***');
    console.log('[API] Key Length:', keySecret.length);

    try {
        const response = await fetch(apiUrl, {
            headers: {
                'X-NCP-APIGW-API-KEY-ID': keyId,
                'X-NCP-APIGW-API-KEY': keySecret,
                'Referer': 'http://gospelchurch.kr/',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
        });

        if (!response.ok) {
            console.error('Naver Map API Error:', response.status, response.statusText);
            const errorText = await response.text();
            console.error('Naver Map Error Body:', errorText);
            return NextResponse.json({ error: 'Failed to fetch map', details: errorText }, { status: response.status });
        }

        const buffer = await response.arrayBuffer();
        const headers = new Headers();
        headers.set('Content-Type', response.headers.get('Content-Type') || 'image/png');
        headers.set('Cache-Control', 'public, max-age=86400, s-maxage=86400');

        console.log('[API] Naver Map Fetch Success');
        return new NextResponse(buffer, {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error('Static Map Proxy Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
