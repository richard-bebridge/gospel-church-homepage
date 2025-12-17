/**
 * Pre-processes Notion blocks to merge multi-block Gallery DSL into a single block.
 * 
 * Syntax:
 * [gallery scroll-x size=24 gap=12] (Paragraph)
 * - item 1 (Bullet)
 * - item 2 (Bullet)
 * [/gallery] (Paragraph)
 * 
 * Logic:
 * 1. Find 'paragraph' starting with [gallery
 * 2. Collect subsequent blocks until 'paragraph' starting with [/gallery]
 * 3. Merge into a single { type: 'gallery', items: [...Attributes and Content...] }
 */
export const groupGalleryBlocks = (blocks) => {
    if (!blocks) return [];

    const result = [];
    let i = 0;

    while (i < blocks.length) {
        const block = blocks[i];

        // Check for Start Tag in Paragraph
        const isStartTag =
            block.type === 'paragraph' &&
            block.paragraph?.rich_text?.[0]?.plain_text?.trim().startsWith('[gallery');

        if (isStartTag) {
            // Extract Attributes from Start Tag
            const startText = block.paragraph.rich_text.map(t => t.plain_text).join('');
            const attrMatch = startText.match(/^\[gallery\s+(.*?)\]/);
            const attrStr = attrMatch ? attrMatch[1] : '';

            const sizeMatch = attrStr.match(/size=(\d+)/);
            const gapMatch = attrStr.match(/gap=(\d+)/);
            const size = sizeMatch ? parseInt(sizeMatch[1]) : 24;
            const gap = gapMatch ? parseInt(gapMatch[1]) : 12;

            // Collect Content
            const galleryItems = [];
            let j = i + 1;
            let foundEnd = false;

            while (j < blocks.length) {
                const innerBlock = blocks[j];
                const innerText = innerBlock[innerBlock.type]?.rich_text?.map(t => t.plain_text).join('') || '';

                // Check End Tag
                if (innerBlock.type === 'paragraph' && innerText.trim().startsWith('[/gallery]')) {
                    foundEnd = true;
                    j++; // Consume end tag
                    break;
                }

                // Process List Items (or manual text lines)
                if (innerText.trim()) {
                    let textLine = innerText.trim();
                    // Remove bullet if present (Notion might render it as bullet block, or text with dash)
                    // If it's a bullet block, we likely want the text content.

                    // Simple parsing: split by pipe
                    const [src, link] = textLine.split('|').map(s => s.trim());
                    if (src) {
                        galleryItems.push({ src, link });
                    }
                }

                j++;
            }

            if (foundEnd) {
                // Success: Push synthetic block
                result.push({
                    id: block.id,
                    type: 'gallery',
                    gallery: {
                        items: galleryItems,
                        size,
                        gap
                    }
                });
                i = j; // Skip consumed blocks
                continue;
            } else {
                // Failed to find end tag: Treat as normal blocks (fallback)
                // Or maybe just push the start tag and move on?
                // Let's fallback to original behavior (push start tag)
                result.push(block);
                i++;
            }
        } else {
            result.push(block);
            i++;
        }
    }

    return result;
};
