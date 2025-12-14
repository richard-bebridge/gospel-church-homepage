import { Client } from '@notionhq/client';
import { getScripture } from './bible.js';

const NOTION_GOSPEL_DB_ID = process.env.NOTION_GOSPEL_DB_ID;
const NOTION_API_KEY = process.env.NOTION_API_KEY;

const notion = new Client({
    auth: NOTION_API_KEY,
});

/**
 * Fetches the latest Gospel Letter from the database.
 * Sorts by 'Date' descending and picks the first one.
 */
export async function getLatestGospelLetter() {
    if (!NOTION_GOSPEL_DB_ID || !NOTION_API_KEY) {
        console.error("Missing Notion Env Vars");
        return null;
    }

    try {
        const response = await notion.databases.query({
            database_id: NOTION_GOSPEL_DB_ID,
            sorts: [
                {
                    property: 'Date',
                    direction: 'descending',
                },
            ],
            page_size: 1,
        });

        if (response.results.length === 0) {
            return null;
        }

        const page = response.results[0];
        const pageId = page.id;

        // Extract metadata
        const titleProp = page.properties.Title; // Adjust if property name differs
        const dateProp = page.properties.Date;
        const sundayRelation = page.properties.Sunday;

        const title = titleProp?.title?.[0]?.plain_text || "Untitled";
        const date = dateProp?.date?.start || "";

        // Fetch blocks (content)
        const blocks = await fetchBlocks(pageId);

        // Parse content and extract scriptures
        const { content, scriptureTags } = parseContent(blocks);

        // Resolve scripture texts
        const resolvedScriptures = scriptureTags.map(tag => {
            const lookup = getScripture(tag);
            return {
                reference: tag,
                text: lookup.text || null // Ensure null if not found
            };
        });

        return {
            id: pageId,
            title,
            date,
            content, // Array of block objects for NotionRenderer
            scriptureTags: resolvedScriptures, // Array of { reference, text }
        };

    } catch (error) {
        console.error("Error fetching Gospel Letter:", error);
        return null;
    }
}

/**
 * Fetches a list of Gospel Letters.
 * @param {number} limit
 */
export async function getGospelLetters(limit = 10) {
    if (!NOTION_GOSPEL_DB_ID || !NOTION_API_KEY) return [];

    try {
        const response = await notion.databases.query({
            database_id: NOTION_GOSPEL_DB_ID,
            sorts: [
                {
                    property: 'Date',
                    direction: 'descending',
                },
            ],
            page_size: limit,
        });

        return response.results.map(page => {
            const title = page.properties.Title?.title?.[0]?.plain_text || "Untitled";
            const date = page.properties.Date?.date?.start || "";
            return {
                id: page.id,
                title,
                date,
            };
        });
    } catch (error) {
        console.error("Error fetching Gospel Letters:", error);
        return [];
    }
}

async function fetchBlocks(blockId) {
    const blocks = [];
    let cursor;
    while (true) {
        const { results, next_cursor } = await notion.blocks.children.list({
            start_cursor: cursor,
            block_id: blockId,
        });
        blocks.push(...results);
        if (!next_cursor) {
            break;
        }
        cursor = next_cursor;
    }
    return blocks;
}

function parseContent(blocks) {
    const content = [];
    const scriptureTags = [];

    for (const block of blocks) {
        // Simple heuristic: check if block is paragraph and starts with #
        if (block.type === 'paragraph' && block.paragraph.rich_text.length > 0) {
            const text = block.paragraph.rich_text.map(t => t.plain_text).join('');
            if (text.trim().startsWith('#')) {
                // It's a scripture tag line
                // Can contain multiple tags? " #John 3:16 #Gen 1:1 " or just one line?
                // Assumption: The whole line is tags or starts with one.
                // Let's strip '#' and trim.
                // e.g. text: "#Deut 8:3" -> "Deut 8:3"
                const tags = text.split('#').filter(t => t.trim().length > 0).map(t => t.trim());
                scriptureTags.push(...tags);
                continue; // Skip adding this block to main content
            }
        }
        content.push(block);
    }

    return { content, scriptureTags };
}

