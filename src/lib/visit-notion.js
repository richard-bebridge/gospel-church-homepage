import { getDatabase, getBlocks } from './notion';
import { flattenBlocks, injectVerses } from './notion-utils';
import { getScripture, extractBibleTags, extractPlainBibleReferences } from './bible';

const NOTION_VISIT_DB_ID = process.env.NOTION_VISIT_DB_ID;

export const getVisitContent = async () => {
    if (!NOTION_VISIT_DB_ID) {
        console.warn('NOTION_VISIT_DB_ID is missing');
        return [];
    }

    // console.log(`[getVisitContent] Starting fetch with DB ID: ${NOTION_VISIT_DB_ID}`);
    // console.log(`[getVisitContent] Starting fetch with DB ID: ${NOTION_VISIT_DB_ID}`);


    try {
        // Fetch all pages from the Visit DB
        const results = await getDatabase(NOTION_VISIT_DB_ID, {
            sorts: [
                {
                    property: 'index',
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

                // Extract Verse Property - Loose Search
                const verseEntry = Object.entries(props).find(([k]) => k.toLowerCase().includes('verse'));

                // If found, try to extract text safely
                const verseProp = verseEntry
                    ? (verseEntry[1]?.rich_text?.map(t => t.plain_text).join('') || '')
                    : '';

                // Fetch Blocks (Content)
                let blocks = await getBlocks(id);

                // Extract Scripture Tags logic
                const seenTags = new Set();
                // const flatBlocks = flattenBlocks(blocks); // Removed to preserve column_list layout
                let processedBlocks = injectVerses(blocks, seenTags);

                // Populate Scripture Tags Data
                let scriptureTags = [];

                if (rightPanelType === 'verse' && verseProp) {
                    const refs = extractPlainBibleReferences(verseProp);
                    // Take up to 2 items
                    refs.slice(0, 2).forEach(ref => {
                        const start = parseInt(ref.verse, 10);
                        const end = ref.endVerse ? parseInt(ref.endVerse, 10) : start;

                        let combinedTextArray = [];
                        const safeEnd = (end >= start && (end - start) < 20) ? end : start;

                        for (let v = start; v <= safeEnd; v++) {
                            const t = getScripture(`${ref.book} ${ref.chapter}:${v}`).text;
                            if (t) combinedTextArray.push(t);
                        }

                        if (combinedTextArray.length > 0) {
                            let displayRef = `${ref.book} ${ref.chapter}:${start}`;
                            if (safeEnd > start) displayRef += `-${safeEnd}`;

                            scriptureTags.push({
                                reference: displayRef,
                                text: combinedTextArray.join(' ')
                            });
                        }
                    });
                } else {
                    // Fallback: Scan text content for tags
                    const subTitleTags = findProp('Subtitle')?.rich_text?.map(rt => rt.plain_text).join('') || '';
                    extractBibleTags(subTitleTags).forEach(tag => seenTags.add(tag.full));

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
                }

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
                const headingIndex = processedBlocks.findIndex(b => b.type === 'heading_1');
                if (headingIndex !== -1) {
                    const headBlock = processedBlocks[headingIndex];
                    heading = headBlock.heading_1?.rich_text?.[0]?.plain_text || '';
                    processedBlocks.splice(headingIndex, 1);
                }

                return {
                    id,
                    title, // e.g. "Identity" (Small Label)
                    subTitle,
                    rightPanelType,
                    imgSrc,
                    subSectionCount,
                    heading,
                    content: processedBlocks,
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
