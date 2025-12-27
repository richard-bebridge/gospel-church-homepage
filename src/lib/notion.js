import { Client } from '@notionhq/client';

const notion = new Client({
    auth: process.env.NOTION_API_KEY,
    fetch: (url, options) => {
        return fetch(url, {
            ...options,
            next: { revalidate: 0 }, // Force no-cache for App Router
        });
    }
});

export const getDatabase = async (databaseId, options = {}) => {
    try {
        const response = await notion.databases.query({
            database_id: databaseId,
            sorts: options.sorts || [
                {
                    timestamp: 'created_time',
                    direction: 'descending',
                },
            ],
            page_size: options.page_size,
        });
        return response.results;
    } catch (error) {
        console.error('Error fetching from Notion:', error);
        throw error;
    }
};

export const getPage = async (pageId) => {
    const response = await notion.pages.retrieve({ page_id: pageId });
    return response;
};

export const getBlocks = async (blockId) => {
    let results = [];
    let cursor = undefined;

    while (true) {
        const response = await notion.blocks.children.list({
            block_id: blockId,
            page_size: 100, // Max page size
            start_cursor: cursor,
        });

        results = [...results, ...response.results];

        if (!response.has_more) {
            break;
        }
        cursor = response.next_cursor;
    }

    // Recursively fetch children for blocks that have them
    const blocksWithChildren = await Promise.all(results.map(async (block) => {
        if (block.has_children) {
            const children = await getBlocks(block.id);
            return { ...block, children };
        }
        return block;
    }));

    return blocksWithChildren;
};
