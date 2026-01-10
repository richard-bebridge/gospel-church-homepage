import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getSiteSettings } from '../../lib/site-settings';
import { getDatabase, getBlocks, getPage } from '../../lib/notion';
import { getMessagesSummary } from '../../lib/data/getMessagesSummary'; // Uses the new utility
import SermonPresentation from '../../components/SermonPresentation';
import { flattenBlocks, injectVerses, groupSections } from '../../lib/notion-utils';

// Revalidate every hour
export const revalidate = 0;

export const metadata = {
    title: '가스펠교회 말씀 | 복음 중심 설교',
    description: '가스펠교회의 설교 메시지를 통해 말씀 안에서 하나님을 배우고 삶에 적용하세요.',
    alternates: {
        canonical: 'https://gospelchurch.kr/messages',
    },
    openGraph: {
        title: '가스펠교회 말씀 | 복음 중심 설교',
        description: '가스펠교회의 설교 메시지를 통해 말씀 안에서 하나님을 배우고 삶에 적용하세요.',
        url: 'https://gospelchurch.kr/messages',
        siteName: 'Gospel Church',
        locale: 'ko_KR',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: '가스펠교회 말씀 | 복음 중심 설교',
        description: '가스펠교회의 설교 메시지를 통해 말씀 안에서 하나님을 배우고 삶에 적용하세요.',
    },
};

export default async function MessagesPage() {
    // Sunday_DB is the HUB - contains Date, YouTube, Sound, and relations to content
    const sundayDbId = process.env.NOTION_SUNDAY_DB_ID || process.env.NOTION_SUNDAY_DB;

    let page = null;         // Sunday_DB page (hub with media links)
    let contentPage = null;  // Sermon_DB page (content via relation)
    let blocks = [];
    let mediaLinks = { youtube: "", audio: "" };
    let fetchError = null;

    if (!sundayDbId) {
        fetchError = "NOTION_SUNDAY_DB_ID is not set in .env file.";
    } else {
        try {
            // 1. Fetch the latest entry from Sunday_DB (the hub)
            const sundayEntries = await getDatabase(sundayDbId, {
                page_size: 20
            });

            // Sort by Date Descending
            if (sundayEntries && sundayEntries.length > 0) {
                sundayEntries.sort((a, b) => {
                    const dateA = a.properties?.Date?.date?.start || a.created_time;
                    const dateB = b.properties?.Date?.date?.start || b.created_time;
                    return new Date(dateB) - new Date(dateA);
                });
                page = sundayEntries[0]; // This is the Sunday_DB hub page

                // 2. Get content from Sermon_DB relation
                let contentPageId = page.id;
                const sermonRelation = page.properties?.['Sermon_DB']?.relation;

                if (sermonRelation && sermonRelation.length > 0) {
                    contentPageId = sermonRelation[0].id;


                    // Fetch the Sermon_DB page for content
                    try {
                        contentPage = await getPage(contentPageId);
                    } catch (err) {
                        console.error("Failed to fetch Sermon_DB page", err);
                    }
                }

                // Fetch blocks from the content page (Manuscript)
                blocks = await getBlocks(contentPageId);

                // Fallback: If Linked Page is empty, try Hub Page
                if (blocks.length === 0 && contentPageId !== page.id) {
                    const hubBlocks = await getBlocks(page.id);
                    if (hubBlocks.length > 0) {
                        blocks = hubBlocks;
                        contentPageId = page.id; // Revert to Hub Page being the source
                    }
                }

                // 3. Extract Media Links from Sunday_DB (page) directly
                const getMediaUrl = (prop) => {
                    if (!prop) return "";
                    // URL type property
                    if (prop.url) return prop.url;
                    // Files type property (file or external URL)
                    if (prop.files && prop.files.length > 0) {
                        const fileObj = prop.files[0];
                        return fileObj.file?.url || fileObj.external?.url || "";
                    }
                    // Rich text type (might contain URL)
                    if (prop.rich_text && prop.rich_text.length > 0) {
                        const richText = prop.rich_text[0];
                        return richText.href || richText.plain_text || "";
                    }
                    return "";
                };

                // page IS Sunday_DB now, so get media directly from it
                mediaLinks.youtube = getMediaUrl(page.properties?.YouTube) || getMediaUrl(page.properties?.Youtube);
                mediaLinks.audio = getMediaUrl(page.properties?.Sound) || getMediaUrl(page.properties?.Audio);
            }
        } catch (e) {
            fetchError = "Failed to fetch data. Please check Notion API Keys and DB IDs.";
            console.error(e);
        }
    }

    if (page && blocks.length > 0) {
        // 1. Flatten Blocks (Remove Columns/Layout)
        blocks = flattenBlocks(blocks);
        // 2. Inject Verses (and remove tags)
        blocks = injectVerses(blocks, new Set());
    }

    if (fetchError || !page) {
        return (
            <div className="min-h-screen bg-[#F4F3EF] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Sermon Not Found</h1>
                    <p className="text-red-500">{fetchError || "No sermon data available."}</p>
                </div>
            </div>
        );
    }

    // 2. Group Sections
    const sections = groupSections(blocks);

    // 3. Prepare Data for Presentation
    // Concatenate all text blocks in title (Notion can split titles into multiple blocks)
    const getFullTitle = (titleArray) => {
        if (!titleArray || !Array.isArray(titleArray)) return "";
        return titleArray.map(t => t.plain_text || "").join("");
    };

    const titleFromContent = getFullTitle(contentPage?.properties?.Name?.title);
    const titleFromHub = getFullTitle(page.properties?.Name?.title);

    const sermonData = {
        title: titleFromContent || titleFromHub || "Untitled Sermon",
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
        getMessagesSummary(page.id, sundayDbId),
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
