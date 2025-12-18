/**
 * Extracts [map::x,y] token from text.
 * Returns the coordinates and the cleaned text.
 * 
 * @param {string} text - The input text or joined block text
 * @returns {{ x: string, y: string, hasMap: boolean } | null}
 */
export const extractMapToken = (text) => {
    if (!text) return null;

    // Pattern: [map::x,y]
    // Handles optional spaces: [map:: 123.456 , 789.012 ]
    const regex = /\[map::\s*([0-9.]+)\s*,\s*([0-9.]+)\s*\]/;
    const match = text.match(regex);

    if (match) {
        return {
            x: match[1],
            y: match[2],
            hasMap: true,
            originalMatch: match[0]
        };
    }

    return null;
};

/**
 * Filters out map tokens from a list of blocks recursively.
 * Used to hide the token from the NotionRenderer.
 * 
 * @param {Array} blocks 
 * @returns {Array} Filtered blocks
 */
export const filterMapTokensFromBlocks = (blocks) => {
    if (!blocks) return [];

    return blocks.map(block => {
        // Clone block to avoid mutation issues if shallow
        const newBlock = { ...block };

        if (newBlock.type === 'paragraph' && newBlock.paragraph?.rich_text) {
            newBlock.paragraph.rich_text = newBlock.paragraph.rich_text.filter(t => {
                const plain = t.plain_text || '';
                // If the token is the ONLY thing in this text node, remove it
                if (plain.match(/^\[map::.*?\]$/)) return false;
                return true;
            }).map(t => {
                // If token is embedded, remove it from content
                if (t.plain_text && t.plain_text.includes('[map::')) {
                    return {
                        ...t,
                        plain_text: t.plain_text.replace(/\[map::.*?\]/g, ''),
                        text: { ...t.text, content: t.text.content.replace(/\[map::.*?\]/g, '') }
                    };
                }
                return t;
            });
        }
        return newBlock;
    });
};
