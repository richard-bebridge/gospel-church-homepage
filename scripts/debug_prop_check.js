
import { Client } from '@notionhq/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Manually read .env from project root
const envPath = path.join(__dirname, '../.env');
let envVars = {};
try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const parts = line.split('=');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            const value = parts.slice(1).join('=').trim();
            envVars[key] = value;
        }
    });
} catch (e) {
    console.error("Could not read .env file:", e.message);
    process.exit(1);
}

const NOTION_API_KEY = envVars.NOTION_API_KEY;
// const NOTION_SERMON_DB_ID = envVars.NOTION_SERMON_DB_ID;
const NOTION_SERMON_DB_ID = '2c1a986a-264f-807b-bfc7-d0c783e3959d';

if (!NOTION_API_KEY || !NOTION_SERMON_DB_ID) {
    console.error("Missing env vars. API_KEY:", !!NOTION_API_KEY, "DB_ID:", !!NOTION_SERMON_DB_ID);
    process.exit(1);
}

// 2. Initialize Notion Client
const notion = new Client({
    auth: NOTION_API_KEY,
});


async function debugData() {
    try {
        console.log("Querying Database:", NOTION_SERMON_DB_ID);
        const response = await notion.databases.query({
            database_id: NOTION_SERMON_DB_ID,
            page_size: 5,
            sorts: [
                {
                    timestamp: 'created_time',
                    direction: 'descending',
                },
            ],
        });

        console.log(`Found ${response.results.length} items.`);

        // Log the properties of the first 3 items to check consistency
        response.results.forEach((page, idx) => {
            console.log(`\n--- Item ${idx + 1} (${page.id}) ---`);
            console.log("Available Keys:", Object.keys(page.properties));
            const sound = page.properties['Sound'] || page.properties['Audio'];
            const youtube = page.properties['YouTube'] || page.properties['Youtube']; // Check cap variations

            console.log("Sound Prop Type:", sound?.type);
            console.log("Sound Prop Value:", JSON.stringify(sound, null, 2));

            console.log("YouTube Prop Type:", youtube?.type);
            console.log("YouTube Prop Value:", JSON.stringify(youtube, null, 2));

            // Test extraction logic
            const extract = (prop) => {
                if (!prop) return "MISSING";
                if (prop.url) return prop.url;
                if (prop.files && prop.files.length > 0) return "FILE:" + JSON.stringify(prop.files[0]);
                return "UNKNOWN_FORMAT";
            };
            console.log("Extracted Sound:", extract(sound));
            console.log("Extracted YouTube:", extract(youtube));
        });

    } catch (e) {
        console.error("Error querying notion:", e);
    }
}


debugData();
