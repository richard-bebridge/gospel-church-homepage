import { getDatabase, getBlocks } from '../notion.js';
import { getGospelLetters } from '../gospel-notion.js';
import { flattenBlocks } from '../notion-utils.js';

// Update signature to accept currentLetterId
export const getMessagesSummary = async (currentSermonId, currentLetterId = null, databaseId = process.env.NOTION_SERMON_DB_ID) => {
    let messagesSummary = {
        latestLetter: null,
        olderLetters: [],
        previousSermon: null,
        olderSermons: []
    };

    try {
        // 1. GOSPEL LETTERS
        // Fetch top 5 letters to account for potential exclusion
        const letters = await getGospelLetters(5);
        if (letters && letters.length > 0) {
            const absoluteLatestId = letters[0].id;

            // Filter out the current letter if provided
            const otherLetters = currentLetterId
                ? letters.filter(l => l.id !== currentLetterId)
                : letters;

            if (otherLetters.length > 0) {
                const latestLetterPage = otherLetters[0];
                // Fetch blocks for snippet
                try {
                    const letterBlocks = await getBlocks(latestLetterPage.id);
                    const flatLetter = flattenBlocks(letterBlocks);
                    const firstPara = flatLetter.find(b => b.type === 'paragraph' && b.paragraph.rich_text.length > 0);
                    const snippet = firstPara
                        ? firstPara.paragraph.rich_text.map(t => t.plain_text).join('')
                        : "";

                    messagesSummary.latestLetter = {
                        ...latestLetterPage,
                        snippet: snippet,
                        isLatest: latestLetterPage.id === absoluteLatestId
                    };
                    // Slice next 3 for the list
                    messagesSummary.olderLetters = otherLetters.slice(1, 4);
                } catch (e) {
                    console.error("Error fetching letter details", e);
                    messagesSummary.latestLetter = {
                        ...latestLetterPage,
                        isLatest: latestLetterPage.id === absoluteLatestId
                    };
                    messagesSummary.olderLetters = otherLetters.slice(1, 4);
                }
            }
        }

        // 2. SERMONS (Previous + Older)
        if (databaseId) {
            const sermons = await getDatabase(databaseId, {
                page_size: 20 // Fetch enough to find previous + 3 older
            });

            if (sermons && sermons.length > 0) {
                // Sort by Date Descending
                sermons.sort((a, b) => {
                    const dateA = a.properties?.Date?.date?.start || a.created_time;
                    const dateB = b.properties?.Date?.date?.start || b.created_time;
                    return new Date(dateB) - new Date(dateA);
                });

                // Identify the absolute latest sermon
                const absoluteLatestSermon = sermons[0];

                const otherSermons = sermons.filter(s => s.id !== currentSermonId);

                if (otherSermons.length > 0) {
                    const prevSermonPage = otherSermons[0];
                    try {
                        let contentPageId = prevSermonPage.id;
                        const sermonRelation = prevSermonPage.properties?.['Sermon']?.relation;
                        if (sermonRelation && sermonRelation.length > 0) {
                            contentPageId = sermonRelation[0].id;
                        }

                        const prevSermonBlocks = await getBlocks(contentPageId);
                        const flatSermon = flattenBlocks(prevSermonBlocks);
                        const firstPara = flatSermon.find(b => b.type === 'paragraph' && b.paragraph.rich_text.length > 0);
                        const snippet = firstPara
                            ? firstPara.paragraph.rich_text.map(t => t.plain_text).join('')
                            : "";

                        messagesSummary.previousSermon = {
                            id: prevSermonPage.id,
                            title: prevSermonPage.properties?.Name?.title?.[0]?.plain_text || "Untitled",
                            date: prevSermonPage.properties?.Date?.date?.start || "",
                            snippet: snippet,
                            isLatest: prevSermonPage.id === absoluteLatestSermon.id
                        };
                    } catch (e) {
                        console.error("Error fetching sermon details", e);
                    }

                    // Older sermons: We want 3 items in the list.
                    // slice(1, 4) gives indices 1, 2, 3 (max 3 items).
                    messagesSummary.olderSermons = otherSermons.slice(1, 4).map(s => ({
                        id: s.id,
                        title: s.properties?.Name?.title?.[0]?.plain_text || "Untitled",
                        date: s.properties?.Date?.date?.start || ""
                    }));
                }
            }
        }
    } catch (e) {
        console.error("Error fetching summary data", e);
    }

    return messagesSummary;
};
