import { Client } from '@notionhq/client';

const NOTION_SUNDAY_DB_ID = process.env.NOTION_SUNDAY_DB_ID || process.env.NOTION_SUNDAY_DB;
const NOTION_API_KEY = process.env.NOTION_API_KEY;

const notion = new Client({
    auth: NOTION_API_KEY,
});

/**
 * Fetches a list of Sermons (Sunday Service).
 * @param {number} limit
 */
export async function getSermons(limit = 10) {
    if (!NOTION_SUNDAY_DB_ID || !NOTION_API_KEY) {
        console.error("Missing Notion Env Vars for Sermons");
        return [];
    }

    try {
        const response = await notion.databases.query({
            database_id: NOTION_SUNDAY_DB_ID,
            sorts: [
                {
                    property: 'Date',
                    direction: 'descending',
                },
            ],
            page_size: limit,
        });

        return response.results.map(page => {
            // Need to adjust property names based on actual DB schema.
            // Based on /test/page.jsx debug logic:
            // Title = Name?
            const title = page.properties.Name?.title?.[0]?.plain_text ||
                page.properties.Title?.title?.[0]?.plain_text || "Untitled Sermon";
            const date = page.properties.Date?.date?.start || "";

            return {
                id: page.id,
                title,
                date,
            };
        });
    } catch (error) {
        console.error("Error fetching Sermons:", error);
        return [];
    }
}
