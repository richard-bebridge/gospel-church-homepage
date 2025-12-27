import { Client } from '@notionhq/client';
import { unstable_cache } from 'next/cache';
import { getScripture } from './bible';

const NOTION_HOME_DB_ID = process.env.NOTION_HOME_DB_ID;
const NOTION_API_KEY = process.env.NOTION_API_KEY;

const notion = new Client({ auth: NOTION_API_KEY });

async function fetchHomeContentFromNotion() {
    if (!NOTION_HOME_DB_ID) return [];

    try {
        const response = await notion.databases.query({
            database_id: NOTION_HOME_DB_ID,
            sorts: [
                { property: 'index', direction: 'ascending' }
            ]
        });

        // Map over pages
        const sections = await Promise.all(response.results.map(async (page, index) => {
            const props = page.properties;

            // 0. Index (for explicit ordering if needed locally, though query handles sort)
            const sortIndex = props.index?.number || 0;

            // 1. English Title (Name)
            const titleEn = props.Name?.title?.[0]?.plain_text || "";

            // 2. Verse (Relation? Text?) 
            // Inspection showed 'verse' is rich_text: "고전 13:4"
            const verseRef = props.verse?.rich_text?.[0]?.plain_text || "";
            let verseData = null;
            if (verseRef) {
                // Resolves KR + EN text
                verseData = getScripture(verseRef);
            }

            // 3. Korean Text (Body Blocks)
            let koreanParagraphs = [];
            try {
                const blocks = await notion.blocks.children.list({ block_id: page.id });
                // Filter for paragraphs
                koreanParagraphs = blocks.results
                    .filter(b => b.type === 'paragraph')
                    .map(b => b.paragraph.rich_text.map(t => t.plain_text).join(""))
                    .filter(text => text.length > 0); // Remove empty blocks
            } catch (blockErr) {
                console.error(`[HomeNotion] Block fetch error for ${titleEn}:`, blockErr);
            }

            // 4. Relations (Subtitle & Link)
            let subtitle = "";
            let linkUrl = null;
            let linkLabel = "";

            const aboutRel = props.About_PG?.relation;
            const visitRel = props.Visit_PG?.relation;

            // Helper to slugify
            const toSlug = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

            if (aboutRel && aboutRel.length > 0) {
                try {
                    const relatedPage = await notion.pages.retrieve({ page_id: aboutRel[0].id });
                    subtitle = relatedPage.properties?.Name?.title?.[0]?.plain_text ||
                        relatedPage.properties?.Page?.title?.[0]?.plain_text || "Sub Section";
                    linkUrl = `/about#${toSlug(subtitle)}`;
                    linkLabel = subtitle;
                } catch (e) { console.warn("Failed to fetch About relation", e); }
            } else if (visitRel && visitRel.length > 0) {
                try {
                    const relatedPage = await notion.pages.retrieve({ page_id: visitRel[0].id });
                    subtitle = relatedPage.properties?.Name?.title?.[0]?.plain_text || "Sub Section";
                    linkUrl = `/visit#${toSlug(subtitle)}`;
                    linkLabel = subtitle;
                } catch (e) { console.warn("Failed to fetch Visit relation", e); }
            }

            return {
                id: page.id,
                index, // Keep array index for UI layout logic (RightPanel uses activeSection index)
                sortIndex,
                titleEn,
                koreanParagraphs,
                verse: verseData, // { text, textEn, normalizedReference }
                subtitle,
                linkUrl,
                linkLabel
            };
        }));

        return sections;
    } catch (error) {
        console.error("[HomeNotion] Fetch failed:", error);
        return [];
    }
}

export const getHomeContent = unstable_cache(
    async () => fetchHomeContentFromNotion(),
    ['home-content'],
    { revalidate: 60, tags: ['home'] }
);
