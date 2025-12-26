import { getDatabase, getBlocks } from './notion';
import { flattenBlocks, injectVerses } from './notion-utils';
import { getScripture, extractBibleTags, extractPlainBibleReferences } from './bible';

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

                // Extract Mobile Visibility Checkbox
                const mobileProp = findProp('Mobile') || findProp('Mobile View') || findProp('mobile');
                const showRightPanelMobile = mobileProp?.checkbox || false;

                // Extract sort index
                const sortIndex = findProp('index')?.number || 999;

                // Normalize Right Panel Type
                const rawRightPanelType = rightPanelProp?.select?.name || rightPanelProp?.multi_select?.[0]?.name || 'none';
                const rightPanelType = rawRightPanelType.toLowerCase().trim();

                // Fetch Blocks (Content)
                let blocks = await getBlocks(id);

                // Extract Verse Property (New) - Loose Search
                const verseEntry = Object.entries(props).find(([k]) => k.toLowerCase().includes('verse'));
                const verseProp = verseEntry
                    ? (verseEntry[1]?.rich_text?.map(t => t.plain_text).join('') || '')
                    : '';

                // Extract Scripture Tags logic
                // 1. If rightPanelType is 'verse' AND verseProp exists, use that.
                // 2. Otherwise fall back to scan tags in Subtitle or Content.
                const seenTags = new Set();

                if (rightPanelType === 'verse' && verseProp) {
                    const refs = extractPlainBibleReferences(verseProp);
                    // Take up to 2 distinct references (but if ranges expand, we show all verses in range)
                    refs.slice(0, 2).forEach(ref => {
                        const start = parseInt(ref.verse, 10);
                        const end = ref.endVerse ? parseInt(ref.endVerse, 10) : start;

                        // Safety check: don't loop too much if typo (e.g. 1-100)
                        if (end >= start && (end - start) < 20) {
                            for (let v = start; v <= end; v++) {
                                // Add to seenTags for consistency, but we really care about tagsForPanel below
                                const cleanKey = `${ref.book} ${ref.chapter}:${v}`;
                                seenTags.add(cleanKey);
                            }
                        } else {
                            const cleanKey = `${ref.book} ${ref.chapter}:${ref.verse}`;
                            seenTags.add(cleanKey);
                        }
                    });
                } else {
                    // Fallback to original scanning behavior
                    const flatBlocks = flattenBlocks(blocks);
                    // We modify contentBlocks here if we injected verses? 
                    // Original code: let contentBlocks = injectVerses(flatBlocks, seenTags);
                    // If we are NOT in 'verse' mode or empty verse prop, we scan content.
                    const subTitleTags = findProp('Subtitle')?.rich_text?.map(rt => rt.plain_text).join('') || '';
                    extractBibleTags(subTitleTags).forEach(tag => seenTags.add(tag.full.replace(/^[#\(]/, '').replace(/\)$/, '')));

                    // Also scan content blocks for tags (original functional)
                    // Note: injectVerses populates seenTags by side effect or return?
                    // flattenBlocks returns blocks. injectVerses returns blocks and modifies seenTags set?
                    // Let's check original code. 
                    // Original: let contentBlocks = injectVerses(flatBlocks, seenTags);
                    // injectVerses scans content for #Tag and adds to seenTags.
                }

                // Process Content Blocks always (legacy behavior kept for layout)
                const flatBlocks = flattenBlocks(blocks);
                // Passing a new Set if we don't want to mix content tags into Right Panel when explicit 'verse' property is used?
                // The user request says: "verse로 된 right panel은 해당 verse를 보이게 해줘"
                // This implies ONLY the `verse` property should populate the panel?
                // Let's separate the sets.

                let scriptureTags = [];

                if (rightPanelType === 'verse' && verseProp) {
                    const refs = extractPlainBibleReferences(verseProp);
                    // Take up to 2 items (ranges or singles)
                    refs.slice(0, 2).forEach(ref => {
                        const start = parseInt(ref.verse, 10);
                        const end = ref.endVerse ? parseInt(ref.endVerse, 10) : start;

                        let combinedTextArray = [];
                        // Safety check: don't loop too much if typo (e.g. 1-100)
                        const safeEnd = (end >= start && (end - start) < 20) ? end : start;

                        for (let v = start; v <= safeEnd; v++) {
                            // fetch each verse
                            const t = getScripture(`${ref.book} ${ref.chapter}:${v}`).text;
                            if (t) combinedTextArray.push(t);
                        }

                        if (combinedTextArray.length > 0) {
                            let displayRef = `${ref.book} ${ref.chapter}:${start}`;
                            if (safeEnd > start) {
                                displayRef += `-${safeEnd}`;
                            }

                            scriptureTags.push({
                                reference: displayRef,
                                text: combinedTextArray.join(' ')
                            });
                        }
                    });
                } else {
                    // Fallback to original scanning behavior using tagsForPanel
                    let tagsForPanel = new Set();

                    const subTitleTags = findProp('Subtitle')?.rich_text?.map(rt => rt.plain_text).join('') || '';
                    extractBibleTags(subTitleTags).forEach(tag => tagsForPanel.add(tag.full.replace(/^[#\(]/, '').replace(/\)$/, '')));

                    // Process Content Blocks always (legacy behavior kept for layout)
                    const flatBlocksOriginal = flattenBlocks(blocks);
                    const tempSet = new Set();
                    injectVerses(flatBlocksOriginal, tempSet);
                    tempSet.forEach(t => tagsForPanel.add(t));

                    Array.from(tagsForPanel).forEach(tagStr => {
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
                        console.error(`[AboutNotion] Failed to fetch blocks for related page ${relatedPageId}`, e);
                    }
                }

                // Process Content Blocks always (legacy behavior kept for layout)
                // We always want to strip tags from content if they exist
                const flatBlocksForDisplay = flattenBlocks(blocks);
                let processedBlocks = injectVerses(flatBlocksForDisplay, new Set()); // Pass dummy set just to strip

                // Extract First Heading 1 for Main Title
                let heading = '';
                const headingIndex = processedBlocks.findIndex(b => b.type === 'heading_1');
                if (headingIndex !== -1) {
                    const headBlock = processedBlocks[headingIndex];
                    heading = headBlock.heading_1?.rich_text?.[0]?.plain_text || '';
                    if (processedBlocks.length > 1) {
                        processedBlocks.splice(headingIndex, 1);
                    }
                }

                // Extract table_type for layout customization
                const tableTypeProp = findProp('table_type') || findProp('table_t');
                const tableType = tableTypeProp?.number || null;

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
                    showRightPanelMobile,
                    tableType, // Type 1, 2, or 3 for table layout
                    sortIndex,
                };
            } catch (error) {
                console.error(`[getAboutContent] Error processing section ${page.id}:`, error);
                return null;
            }
        }));

        const validSections = sections.filter(s => {
            if (!s) return false;

            // Check if content has at least one non-empty block
            const hasGridContent = s.content && s.content.some(block => {
                // If it's a paragraph, ensure it has text
                if (block.type === 'paragraph') {
                    return block.paragraph?.rich_text?.length > 0;
                }
                // Other blocks (headings, images, etc.) count as content
                return true;
            });

            // Also check for page content if it's a page type
            const hasPageContent = s.rightPanelType === 'page' && s.pageContent && s.pageContent.length > 0;

            // Check for heading - sections with heading should be kept even if content is empty
            const hasHeading = s.heading && s.heading.trim().length > 0;

            // Keep section if it has meaningful grid content OR page content OR heading
            return hasGridContent || hasPageContent || hasHeading;
        });

        // Sort by index
        validSections.sort((a, b) => a.sortIndex - b.sortIndex);

        // console.log(`[getAboutContent] Filtered ${sections.length} -> ${validSections.length} sections.`);
        return validSections;
    } catch (error) {
        console.error('Error fetching About content:', error);
        return [];
    }
};
