import { Client } from '@notionhq/client';
import { getBlocks } from './notion';
import { getDatabase } from './notion';

const NOTION_VISIT_DB_ID = process.env.NOTION_VISIT_DB_ID;

export const getVisitContent = async () => {
    if (!NOTION_VISIT_DB_ID) {
        console.warn('NOTION_VISIT_DB_ID is missing');
        return [];
    }

    try {
        // Fetch all pages from the Visit DB
        const results = await getDatabase(NOTION_VISIT_DB_ID, {
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

            const subSectionCount = props.sub_section?.number || 0;
            const subTitle = props.Subtitle?.rich_text?.[0]?.plain_text || ''; // Optional English/Subtitle

            // Fetch Blocks (Content)
            let blocks = await getBlocks(id);

            // Extract First Heading 1 for Main Title
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
                relatedPageId, // Pass to frontend for fetching dynamic content
                propertyKeys: Object.keys(props)
            };
        }));

        return sections;
    } catch (error) {
        console.error('Error fetching Visit content:', error);
        return [];
    }
};
