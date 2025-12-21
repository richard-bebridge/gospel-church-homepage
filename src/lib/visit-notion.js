import { getDatabase, getBlocks } from './notion';
import { flattenBlocks, injectVerses } from './notion-utils';
import { getScripture, extractBibleTags } from './bible';

const NOTION_VISIT_DB_ID = process.env.NOTION_VISIT_DB_ID;

export const getVisitContent = async () => {
    if (!NOTION_VISIT_DB_ID) {
        console.warn('NOTION_VISIT_DB_ID is missing');
        return [];
    }

    // console.log(`[getVisitContent] Starting fetch with DB ID: ${NOTION_VISIT_DB_ID}`);


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
            try {
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

                // Extract Mobile Visibility Checkbox
                const mobileProp = findProp('Mobile') || findProp('Mobile View') || findProp('mobile');
                const showRightPanelMobile = mobileProp?.checkbox || false;

                const subSectionCount = props.sub_section?.number || 0;
                const subTitle = props.Subtitle?.rich_text?.[0]?.plain_text || ''; // Optional English/Subtitle

                // Fetch Blocks (Content)
                let blocks = await getBlocks(id);

                // Extract Scripture Tags if type is 'verse' or always?
                const seenTags = new Set();
                const flatBlocks = flattenBlocks(blocks);
                let contentBlocks = injectVerses(flatBlocks, seenTags);

                // Also check Subtitle for tags
                const subTitleTags = findProp('Subtitle')?.rich_text?.map(rt => rt.plain_text).join('') || '';
                extractBibleTags(subTitleTags).forEach(tag => seenTags.add(tag.full));

                const scriptureTags = [];
                Array.from(seenTags).forEach(tagStr => {
                    const cleanRef = tagStr.replace(/^[#\(]/, '').replace(/\)$/, '');
                    const lookup = getScripture(cleanRef);
                    if (lookup.text) {
                        scriptureTags.push({
                            reference: lookup.normalizedReference || cleanRef,
                            text: lookup.text
                        });
                    }
                });

                // Fetch related page blocks if rightPanelType is 'page'
                let pageContent = null;
                if (rightPanelType === 'page' && relatedPageId) {
                    try {
                        pageContent = await getBlocks(relatedPageId);
                    } catch (e) {
                        console.error(`[VisitNotion] Failed to fetch blocks for related page ${relatedPageId}`, e);
                    }
                }

                // Extract First Heading 1 for Main Title
                let heading = '';
                const headingIndex = contentBlocks.findIndex(b => b.type === 'heading_1');
                if (headingIndex !== -1) {
                    const headBlock = contentBlocks[headingIndex];
                    heading = headBlock.heading_1?.rich_text?.[0]?.plain_text || '';
                    contentBlocks.splice(headingIndex, 1);
                }

                return {
                    id,
                    title, // e.g. "Identity" (Small Label)
                    subTitle,
                    rightPanelType,
                    imgSrc,
                    subSectionCount,
                    heading,
                    content: contentBlocks,
                    relatedPageId,
                    pageContent,
                    scriptureTags,
                    showRightPanelMobile,
                    propertyKeys: Object.keys(props)
                };
            } catch (sectionError) {
                console.error(`[getVisitContent] Error processing section ${page.id}:`, sectionError);
                return null;
            }
        }));

        const validSections = sections.filter(s => s !== null);
        // console.log(`[getVisitContent] Successfully processed ${validSections.length} sections (filtered from ${results.length}).`);
        return validSections;
    } catch (error) {
        console.error('[getVisitContent] Error fetching Visit content:', error);
        return [];
    }
};
