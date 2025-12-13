import { flattenBlocks, injectVerses } from '../notion-utils';

export const buildGospelLetterPresentationData = (page, blocks) => {
    const title = page.properties?.Name?.title?.[0]?.plain_text || "Untitled";
    const date = page.properties?.Date?.date?.start || "";
    // Author might be a property or assumed
    const author = page.properties?.Author?.rich_text?.[0]?.plain_text || "Pastor";

    // Flatten and inject verses
    let flatBlocks = flattenBlocks(blocks);
    const seenTags = new Set();
    let contentBlocks = injectVerses(flatBlocks, seenTags);

    return {
        id: page.id,
        title,
        date,
        author,
        content: contentBlocks,
        scriptureTags: Array.from(seenTags) // For debugging or side-panels if needed
    };
};
