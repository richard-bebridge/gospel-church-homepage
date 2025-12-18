import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Manually parse .env to avoid dotenv dependency
const envPath = path.join(__dirname, '.env');
let envConfig = {};

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            let value = match[2].trim();
            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            envConfig[key] = value;
        }
    });
} catch (e) {
    console.error('Error reading .env:', e.message);
}

const clientId = (envConfig.NAVER_ID || '').trim();
const clientSecret = (envConfig.NAVER_API_KEY || '').trim();

console.log('--- Config Check ---');
console.log('Client ID:', clientId);
console.log('Client Secret (Length):', clientSecret.length);
if (clientSecret.length > 5) {
    console.log('Client Secret (First 5):', clientSecret.substring(0, 5));
}
console.log('--------------------');

if (!clientId || !clientSecret) {
    console.error('Keys are missing in .env!');
    process.exit(1);
}

// Request Parameters
const x = '127.0134';
const y = '37.49168';
const url = `https://maps.apigw.ntruss.com/map-static/v2/raster?w=600&h=400&center=${x},${y}&level=16&scale=2`;

console.log('Requesting:', url);

const headers = {
    'X-NCP-APIGW-API-KEY-ID': clientId,
    'X-NCP-APIGW-API-KEY': clientSecret,
    'Referer': 'http://gospelchurch.kr', // Exact match without trailing slash
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

console.log('Headers:', headers);

fetch(url, { headers })
    .then(async res => {
        console.log('Status:', res.status);
        if (!res.ok) {
            const text = await res.text();
            console.log('Error Body:', text);
        } else {
            console.log('Success! Image bytes received:', res.headers.get('content-length'));
        }
    })
    .catch(err => console.error('Fetch Error:', err));
