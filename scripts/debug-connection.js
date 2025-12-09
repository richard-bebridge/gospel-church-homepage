
import { Client } from '@notionhq/client';
// Using node --env-file=.env instead of dotenv module

const notion = new Client({
    auth: process.env.NOTION_API_KEY,
});

const SUNDAY_DB_ID = process.env.NOTION_SUNDAY_DB_ID || process.env.NOTION_SUNDAY_DB;

async function debugConnection() {
    console.log("--- Starting Connection Debug ---");
    console.log(`Checking API Key: ${process.env.NOTION_API_KEY ? 'Present' : 'MISSING'}`);
    console.log(`Checking Sunday DB ID: ${SUNDAY_DB_ID || 'MISSING'}`);

    if (!process.env.NOTION_API_KEY || !SUNDAY_DB_ID) {
        console.error("Missing credentials. Aborting.");
        return;
    }

    try {
        console.log(`\n1. Attempting to retrieve Database Metadata (ID: ${SUNDAY_DB_ID})...`);
        const db = await notion.databases.retrieve({ database_id: SUNDAY_DB_ID });
        console.log("   SUCCESS! Connected to Database:", db.title?.[0]?.plain_text || "Untitled");
        console.log("   Database Properties:", Object.keys(db.properties).join(", "));

        console.log(`\n2. Attempting to query first 5 items...`);
        const response = await notion.databases.query({
            database_id: SUNDAY_DB_ID,
            page_size: 5,
        });

        console.log(`   SUCCESS! Fetched ${response.results.length} items.`);

        if (response.results.length > 0) {
            const firstItem = response.results[0];
            console.log("   Sampling First Item:");
            console.log("   - ID:", firstItem.id);
            console.log("   - Created:", firstItem.created_time);

            // Log valuable properties
            const props = firstItem.properties;
            if (props.Sermon) console.log("   - Sermon Relation:", JSON.stringify(props.Sermon));
            if (props.Date) console.log("   - Date:", JSON.stringify(props.Date));
            if (props.YouTube) console.log("   - YouTube:", JSON.stringify(props.YouTube));
            if (props.Sound) console.log("   - Sound:", JSON.stringify(props.Sound));
        }

    } catch (error) {
        console.error("\n!!! ERROR OCCURRED !!!");
        console.error("Code:", error.code);
        console.error("Message:", error.message);
        if (error.status === 404) {
            console.error("Hint: 404 usually means the ID is wrong, OR the integration is not added to the page.");
        }
        if (error.status === 401) {
            console.error("Hint: 401 usually means the API Key is invalid.");
        }
        // console.error("Full Error:", error);
    }
}

debugConnection();
