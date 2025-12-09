import { Client } from '@notionhq/client';

const notion = new Client({
    auth: process.env.NOTION_API_KEY,
});

export const getDatabase = async (databaseId) => {
    try {
        const response = await notion.databases.query({
            database_id: databaseId,
            sorts: [
                {
                    timestamp: 'created_time',
                    direction: 'descending',
                },
            ],
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
    const response = await notion.blocks.children.list({
        block_id: blockId,
        page_size: 50,
    });

    const blocks = response.results;

    // Recursively fetch children for blocks that have them
    const blocksWithChildren = await Promise.all(blocks.map(async (block) => {
        if (block.has_children) {
            const children = await getBlocks(block.id);
            return { ...block, children };
        }
        return block;
    }));

    return blocksWithChildren;
};
