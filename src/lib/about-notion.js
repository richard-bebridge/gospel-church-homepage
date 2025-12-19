import { Client } from '@notionhq/client';
import { getBlocks } from './notion';

// Initialize Client (duplicated to avoid circular deps if notion.js changes, or imports)
// Actually we can reuse the client if exported, but notion.js doesn't export the client instance by default.
// Let's just import { getDatabase } and pass ID, or recreate client.
// Reusing getDatabase from './notion' is cleaner.
import { getDatabase } from './notion';

const NOTION_ABOUT_DB_ID = process.env.NOTION_ABOUT_DB_ID;

export const getAboutContent = async () => {
    if (!NOTION_ABOUT_DB_ID) {
        console.warn('NOTION_ABOUT_DB_ID is missing');
        return [];
    }

    try {
        // Fetch all pages from the About DB
        // Sort by 'created_time' ascending? Or manual order?
        // Prompt says "Page order = Notion DB sort order".
        // Let's assume standard sort or add a 'Order' column if needed later.
        // For now, default Notion sort (created_time desc usually, but we want Ascending or custom)
        // Let's use 'created_time' 'ascending' as a proxy for "Insertion Order" if no custom sort.
        // Or if the user sorts manually in view, the API doesn't always reflect that unless 'sorts' is empty?
        // Let's try to query without specific sorts to see if it respects view? No, API defaults to created desc usually.
        // I will use created_time ASC for now.
        const results = await getDatabase(NOTION_ABOUT_DB_ID, {
            sorts: [
                {
                    timestamp: 'created_time',
                    direction: 'ascending',
                },
            ],
        });

        // Map and Fetch Content for each section
        const sections = await Promise.all(results.map(async (page) => {
            const id = page.id;
            const props = page.properties;

            // Extract Fields (Case-insensitive finding)
            const findProp = (name) => {
                const key = Object.keys(props).find(k => k.toLowerCase() === name.toLowerCase());
                return props[key];
            };

            const title = findProp('Name')?.title?.[0]?.plain_text || 'Untitled';
            const rightPanelProp = findProp('right_panel_type');
            const rightPanelType = rightPanelProp?.select?.name || rightPanelProp?.multi_select?.[0]?.name || 'none';
            const imgSrc = findProp('img_src')?.url || null;
            const subSectionCount = findProp('sub_section')?.number || 0;
            const subTitle = findProp('Subtitle')?.rich_text?.[0]?.plain_text || '';

            // Extract related page ID: specific 'etc' OR first available relation
            const etcProp = findProp('etc');
            let relatedPageId = etcProp?.relation?.[0]?.id || null;
            if (!relatedPageId) {
                // Fallback: finding ANY relation property
                const firstRelationKey = Object.keys(props).find(k => props[k].type === 'relation');
                if (firstRelationKey) {
                    relatedPageId = props[firstRelationKey].relation?.[0]?.id || null;
                }
            }

            // Fetch Blocks (Content)
            let blocks = await getBlocks(id);

            // Fetch related page blocks if rightPanelType is 'page'
            let pageContent = null;
            if (rightPanelType === 'page' && relatedPageId) {
                try {
                    pageContent = await getBlocks(relatedPageId);
                } catch (e) {
                    console.error(`[AboutNotion] Failed to fetch blocks for related page ${relatedPageId}`, e);
                }
            }

            // Extract First Heading 1 for Main Title (e.g., "우리가 존재하는 이유")
            // and remove it from the body content.
            let heading = '';
            const headingIndex = blocks.findIndex(b => b.type === 'heading_1');
            if (headingIndex !== -1) {
                const headBlock = blocks[headingIndex];
                heading = headBlock.heading_1?.rich_text?.[0]?.plain_text || '';
                // Remove this block from content so it doesn't dup
                blocks.splice(headingIndex, 1);
            }

            return {
                id,
                title, // e.g. "Identity" (Small Label)
                subTitle,
                rightPanelType,
                imgSrc,
                subSectionCount,
                heading, // e.g. "우리가 존재하는 이유" (Big Title)
                content: blocks,
                relatedPageId,
                pageContent, // Assembled on server
                propertyKeys: Object.keys(props)
            };
        }));

        return sections;
    } catch (error) {
        console.error('Error fetching About content:', error);
        return [];
    }
};
