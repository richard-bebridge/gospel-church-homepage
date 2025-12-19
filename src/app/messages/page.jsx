import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getSiteSettings } from '../../lib/site-settings';
import { getDatabase, getBlocks } from '../../lib/notion';
import { getMessagesSummary } from '../../lib/data/getMessagesSummary'; // Uses the new utility
import SermonPresentation from '../../components/SermonPresentation';
import { flattenBlocks, injectVerses, groupSections } from '../../lib/notion-utils';

// Revalidate every hour
export const revalidate = 3600;

export default async function MessagesPage() {
    const databaseId = process.env.NOTION_SERMON_DB_ID;
    const sundayDbId = process.env.NOTION_SUNDAY_DB_ID || process.env.NOTION_SUNDAY_DB;

    let page = null;
    let blocks = [];
    let mediaLinks = { youtube: "", audio: "" };
    let error = null;

    if (!databaseId) {
        error = "NOTION_SERMON_DB_ID is not set in .env file.";
    } else {
        try {
            // 1. Fetch the latest sermon from Hub DB (NOTION_SERMON_DB_ID)
            const sermons = await getDatabase(databaseId, {
                page_size: 20
            });

            // Sort by Date Descending
            if (sermons && sermons.length > 0) {
                sermons.sort((a, b) => {
                    const dateA = a.properties?.Date?.date?.start || a.created_time;
                    const dateB = b.properties?.Date?.date?.start || b.created_time;
                    return new Date(dateB) - new Date(dateA);
                });
                page = sermons[0];

                // 2. Logic to get Content Blocks (Hub -> Manuscript)
                // Check if this page has a 'Sermon' relation
                let contentPageId = page.id;
                const sermonRelation = page.properties?.['Sermon']?.relation;
                if (sermonRelation && sermonRelation.length > 0) {
                    contentPageId = sermonRelation[0].id;
                }

                // Fetch blocks from the content page (Manuscript)
                blocks = await getBlocks(contentPageId);

                // 3. Extract Media Links (Directly from Hub Page)
                const getMediaUrl = (prop) => {
                    if (!prop) return "";
                    if (prop.url) return prop.url;
                    if (prop.files && prop.files.length > 0) {
                        const fileObj = prop.files[0];
                        return fileObj.file?.url || fileObj.external?.url || "";
                    }
                    return "";
                };

                mediaLinks.youtube = getMediaUrl(page.properties?.YouTube) || getMediaUrl(page.properties?.Youtube);
                mediaLinks.audio = getMediaUrl(page.properties?.Sound) || getMediaUrl(page.properties?.Audio);
            }
        } catch (e) {
            error = "Failed to fetch data. Please check Notion API Keys and DB IDs.";
            console.error(e);
        }
    }

    if (page && blocks.length > 0) {
        // 1. Flatten Blocks (Remove Columns/Layout)
        blocks = flattenBlocks(blocks);
        // 2. Inject Verses (and remove tags)
        blocks = injectVerses(blocks, new Set());
    }

    if (error || !page) {
        return (
            <div className="min-h-screen bg-[#F4F3EF] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Sermon Not Found</h1>
                    <p className="text-red-500">{error || "No sermon data available."}</p>
                </div>
            </div>
        );
    }

    // 2. Group Sections
    const sections = groupSections(blocks);

    // 3. Prepare Data for Presentation
    const sermonData = {
        title: page.properties?.Name?.title?.[0]?.plain_text || "Untitled Sermon",
        date: page.properties?.Date?.date?.start || "",
        preacher: page.properties?.Preacher?.rich_text?.[0]?.plain_text || "",
        scripture: page.properties?.Scripture?.rich_text?.[0]?.plain_text || "",
        youtube: mediaLinks.youtube,
        audio: mediaLinks.audio,
        sections: sections,
    };

    // --- REFACTORED: MESSAGES SUMMARY DATA FETCHING ---
    // Pass current page ID to exclude from "older messages"
    const [messagesSummary, siteSettings] = await Promise.all([
        getMessagesSummary(page.id, databaseId),
        getSiteSettings()
    ]);

    return (
        <div className="min-h-screen bg-[#F4F3EF]">
            <Header siteSettings={siteSettings} />
            <SermonPresentation sermon={sermonData} messagesSummary={messagesSummary} siteSettings={siteSettings}>
                <Footer siteSettings={siteSettings} />
            </SermonPresentation>
        </div>
    );
}
