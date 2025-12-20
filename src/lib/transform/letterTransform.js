import { flattenBlocks, injectVerses } from '../notion-utils.js';
import { getScripture } from '../bible.js';

export const buildGospelLetterPresentationData = (page, blocks) => {
    const title = page.properties?.Title?.title?.[0]?.plain_text || page.properties?.Name?.title?.[0]?.plain_text || "Untitled";
    const date = page.properties?.Date?.date?.start || "";
    // Author might be a property or assumed
    // Author: Support multiple property names and types (rich_text, select, people, or title)
    const getAuthor = (props) => {
        const potentialProps = ['Author', 'Writer', '작성자', 'Name', 'Creator', 'Person'];
        for (const p of potentialProps) {
            const prop = props[p];
            if (!prop) continue;

            // Try rich_text
            if (prop.rich_text && prop.rich_text.length > 0) {
                return prop.rich_text[0].plain_text;
            }
            // Try select
            if (prop.select && prop.select.name) {
                return prop.select.name;
            }
            // Try people
            if (prop.people && prop.people.length > 0) {
                return prop.people[0].name;
            }
            // Try title
            if (prop.title && prop.title.length > 0) {
                return prop.title[0].plain_text;
            }
        }
        return "가스펠교회"; // Default fallback in Korean
    };

    const author = getAuthor(page.properties);

    // Flatten and inject verses
    let flatBlocks = flattenBlocks(blocks);
    const seenTags = new Set();
    let contentBlocks = injectVerses(flatBlocks, seenTags);

    // Resolve scripture tags to objects { reference, text }
    const resolvedTags = [];
    const seenReferences = new Set(); // Track normalized references to deduplicate

    // Process raw tags from the content
    Array.from(seenTags).forEach(tagStr => {
        const cleanRef = tagStr.replace(/^[#\(]/, '').replace(/\)$/, ''); // Remove leading #/( and trailing )
        const lookup = getScripture(cleanRef);

        if (lookup.text && lookup.normalizedReference) {
            if (!seenReferences.has(lookup.normalizedReference)) {
                seenReferences.add(lookup.normalizedReference);
                resolvedTags.push({
                    reference: lookup.normalizedReference, // Use e.g. "신명기 8:3"
                    text: lookup.text
                });
            }
        } else {
            // Fallback if lookup failed (though we might want to skip invalid ones)
            // But if we want to show it as "Not found", we should use cleanRef or some derived ref
            // Let's use cleanRef if normalized is missing (unlikely if getScripture works)
            const ref = lookup.normalizedReference || cleanRef;
            if (!seenReferences.has(ref)) {
                seenReferences.add(ref);
                resolvedTags.push({
                    reference: ref,
                    text: lookup.text || null
                });
            }
        }
    });

    return {
        id: page.id,
        title,
        date,
        author,
        content: contentBlocks,
        scriptureTags: resolvedTags
    };
};
