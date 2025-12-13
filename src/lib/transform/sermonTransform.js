import { flattenBlocks, injectVerses, groupSections } from '../notion-utils';

export const buildSermonPresentationData = (page, blocks) => {
    // 1. Basic Metadata
    const title = page.properties?.Name?.title?.[0]?.plain_text || "Untitled";
    const date = page.properties?.Date?.date?.start || "";

    // Extract media links
    const getMediaUrl = (prop) => {
        if (!prop) return "";
        if (prop.url) return prop.url;
        if (prop.files && prop.files.length > 0) {
            const fileObj = prop.files[0];
            return fileObj.file?.url || fileObj.external?.url || "";
        }
        return "";
    };

    const youtube = getMediaUrl(page.properties?.YouTube || page.properties?.Youtube);
    const audio = getMediaUrl(page.properties?.Sound || page.properties?.Audio);

    // 2. Process Blocks
    // Flatten layout columns
    let flatBlocks = flattenBlocks(blocks);

    // Inject verses (optional for now, but safe to keep if util exists)
    // We use a new Set to track seen tags per sermon
    let processedBlocks = injectVerses(flatBlocks, new Set());

    // Group into sections (Presentation expects: [{ heading, content: [], verses: [] }])
    const sections = groupSections(processedBlocks);

    return {
        id: page.id,
        title,
        date,
        youtube,
        audio,
        sections
    };
};
