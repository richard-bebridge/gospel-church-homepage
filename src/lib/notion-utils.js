import { getVerse, extractBibleTags } from './bible';

// Helper to flatten blocks (remove columns/layout)
export const flattenBlocks = (blocks) => {
    let flat = [];
    for (const block of blocks) {
        if (block.type === 'column_list' || block.type === 'column') {
            if (block.children) {
                flat = flat.concat(flattenBlocks(block.children));
            }
        } else {
            flat.push(block);
        }
    }
    return flat;
};

// Helper to process blocks and inject verses
export const injectVerses = (blocks, seenTags = new Set()) => {
    const newBlocks = [];

    for (const block of blocks) {
        // 1. Check for Heading -> Reset Scope
        if (block.type === 'heading_1' || block.type === 'heading_2' || block.type === 'heading_3') {
            seenTags.clear();
        }

        // 2. Extract text and find tags
        let richText = null;
        if (block.type === 'paragraph') richText = block.paragraph.rich_text;
        else if (block.type === 'heading_1') richText = block.heading_1.rich_text;
        else if (block.type === 'heading_2') richText = block.heading_2.rich_text;
        else if (block.type === 'heading_3') richText = block.heading_3.rich_text;
        else if (block.type === 'bulleted_list_item') richText = block.bulleted_list_item.rich_text;
        else if (block.type === 'numbered_list_item') richText = block.numbered_list_item.rich_text;
        else if (block.type === 'quote') richText = block.quote.rich_text;

        const versesToInject = [];

        if (richText) {
            richText.forEach(rt => {
                const text = rt.plain_text;
                const tags = extractBibleTags(text);

                tags.forEach(tag => {
                    if (!seenTags.has(tag.full)) {
                        seenTags.add(tag.full);
                        const verseText = getVerse(tag.book, tag.chapter, tag.verse);
                        if (verseText) {
                            versesToInject.push({
                                id: `verse-${tag.full}-${Math.random()}`,
                                type: 'bible_verse',
                                bible_verse: {
                                    tag: tag.full,
                                    text: verseText,
                                    reference: `${tag.book} ${tag.chapter}:${tag.verse}`
                                }
                            });

                            // Remove tag from text
                            if (rt.text) rt.text.content = rt.text.content.replace(tag.full, '');
                            rt.plain_text = rt.plain_text.replace(tag.full, '');
                        }
                    }
                });
            });
        }

        // Push original block (now potentially with tags removed)
        newBlocks.push(block);

        // Push injected verses
        versesToInject.forEach(v => newBlocks.push(v));
    }
    return newBlocks;
};

// Helper to group blocks into sections
export const groupSections = (blocks) => {
    const sections = [];
    let currentSection = { heading: null, content: [], verses: [] };

    blocks.forEach(block => {
        if (block.type === 'heading_1' || block.type === 'heading_2' || block.type === 'heading_3') {
            // Push previous section if it has content or verses
            if (currentSection.content.length > 0 || currentSection.verses.length > 0) {
                sections.push(currentSection);
            }
            // Start new section
            const headingText = block[block.type].rich_text.map(t => t.plain_text).join('');
            currentSection = { heading: headingText, content: [], verses: [] };
        } else if (block.type === 'bible_verse') {
            currentSection.verses.push(block.bible_verse);
        } else {
            // Add other blocks to content
            currentSection.content.push(block);
        }
    });

    // Push last section
    if (currentSection.content.length > 0 || currentSection.verses.length > 0) {
        sections.push(currentSection);
    }

    return sections;
};
