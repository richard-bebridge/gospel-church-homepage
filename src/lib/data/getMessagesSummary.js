import { getDatabase, getBlocks, getPage } from '../notion.js';
import { flattenBlocks } from '../notion-utils.js';

// Refactored to use Sunday_DB as hub
// databaseId should be NOTION_SUNDAY_DB_ID
export const getMessagesSummary = async (currentSermonId, currentLetterId = null, databaseId = process.env.NOTION_SUNDAY_DB_ID) => {
    let messagesSummary = {
        latestLetter: null,
        olderLetters: [],
        previousSermon: null,
        olderSermons: []
    };

    try {
        if (!databaseId) {
            console.warn("No databaseId provided to getMessagesSummary");
            return messagesSummary;
        }

        // Query Sunday_DB (the hub)
        const sundayEntries = await getDatabase(databaseId, {
            page_size: 20
        });

        if (!sundayEntries || sundayEntries.length === 0) {
            return messagesSummary;
        }

        // Sort by Date Descending
        sundayEntries.sort((a, b) => {
            const dateA = a.properties?.Date?.date?.start || a.created_time;
            const dateB = b.properties?.Date?.date?.start || b.created_time;
            return new Date(dateB) - new Date(dateA);
        });

        // Helper to get full title from Notion title array
        const getFullTitle = (titleArray) => {
            if (!titleArray || !Array.isArray(titleArray)) return "";
            return titleArray.map(t => t.plain_text || "").join("");
        };

        // 1. SERMONS - from Sermon_DB relations
        const sermonsData = [];


        for (const entry of sundayEntries) {
            const sermonRelation = entry.properties?.['Sermon_DB']?.relation;


            if (sermonRelation && sermonRelation.length > 0) {
                const sermonPageId = sermonRelation[0].id;
                try {
                    const sermonPage = await getPage(sermonPageId);
                    const title = getFullTitle(sermonPage.properties?.Name?.title);


                    sermonsData.push({
                        hubId: entry.id,
                        sermonId: sermonPageId,
                        title: title || "Untitled",
                        date: entry.properties?.Date?.date?.start || "",
                        sermonPage
                    });
                } catch (e) {
                    console.error("    → Error fetching sermon:", e.message);
                }
            }
        }



        // Filter out current sermon
        const otherSermons = sermonsData.filter(s => s.hubId !== currentSermonId && s.sermonId !== currentSermonId);

        if (otherSermons.length > 0) {
            const prevSermon = otherSermons[0];
            // Get snippet
            try {
                const blocks = await getBlocks(prevSermon.sermonId);
                const flat = flattenBlocks(blocks);
                const firstPara = flat.find(b => b.type === 'paragraph' && b.paragraph.rich_text.length > 0);
                const snippet = firstPara
                    ? firstPara.paragraph.rich_text.map(t => t.plain_text).join('')
                    : "";
                messagesSummary.previousSermon = {
                    id: prevSermon.hubId,
                    title: prevSermon.title,
                    date: prevSermon.date,
                    snippet,
                    isLatest: otherSermons[0] === sermonsData[0]
                };
            } catch (e) {
                messagesSummary.previousSermon = {
                    id: prevSermon.hubId,
                    title: prevSermon.title,
                    date: prevSermon.date,
                    snippet: "",
                    isLatest: false
                };
            }

            // Older sermons: next 3
            messagesSummary.olderSermons = otherSermons.slice(1, 4).map(s => ({
                id: s.hubId,
                title: s.title,
                date: s.date
            }));
        }

        // 2. LETTERS - from Letter_DB relations
        const lettersData = [];


        for (const entry of sundayEntries) {
            const letterRelation = entry.properties?.['Letter_DB']?.relation;


            if (letterRelation && letterRelation.length > 0) {
                const letterPageId = letterRelation[0].id;
                try {
                    const letterPage = await getPage(letterPageId);

                    // Debug: dump all properties


                    // Letter_DB uses "Title" property, not "Name"
                    const titleFromName = getFullTitle(letterPage.properties?.Name?.title);
                    const titleFromTitle = getFullTitle(letterPage.properties?.Title?.title);
                    const title = titleFromName || titleFromTitle;


                    lettersData.push({
                        hubId: entry.id,
                        letterId: letterPageId,
                        title: title || "Untitled",
                        date: entry.properties?.Date?.date?.start || "",
                        letterPage
                    });
                } catch (e) {
                    console.error("    → Error fetching letter:", e.message);
                }
            }
        }



        // Filter out current letter
        const otherLetters = lettersData.filter(l => l.hubId !== currentLetterId && l.letterId !== currentLetterId);

        if (otherLetters.length > 0) {
            const latestLetter = otherLetters[0];
            // Get snippet
            try {
                const blocks = await getBlocks(latestLetter.letterId);
                const flat = flattenBlocks(blocks);
                const firstPara = flat.find(b => b.type === 'paragraph' && b.paragraph.rich_text.length > 0);
                const snippet = firstPara
                    ? firstPara.paragraph.rich_text.map(t => t.plain_text).join('')
                    : "";
                messagesSummary.latestLetter = {
                    id: latestLetter.hubId,
                    title: latestLetter.title,
                    date: latestLetter.date,
                    snippet,
                    isLatest: otherLetters[0] === lettersData[0]
                };
            } catch (e) {
                messagesSummary.latestLetter = {
                    id: latestLetter.hubId,
                    title: latestLetter.title,
                    date: latestLetter.date,
                    snippet: "",
                    isLatest: false
                };
            }

            // Older letters: next 3
            messagesSummary.olderLetters = otherLetters.slice(1, 4).map(l => ({
                id: l.hubId,
                title: l.title,
                date: l.date
            }));
        }

    } catch (e) {
        console.error("Error fetching summary data", e);
    }

    return messagesSummary;
};
