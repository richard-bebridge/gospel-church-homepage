import { getDatabase, getBlocks } from '../notion';
import { getGospelLetters } from '../gospel-notion';
import { flattenBlocks } from '../notion-utils';

export const getMessagesSummary = async (currentSermonId, databaseId = process.env.NOTION_SERMON_DB_ID) => {
    let messagesSummary = {
        latestLetter: null,
        olderLetters: [],
        previousSermon: null,
        olderSermons: []
    };

    try {
        // 1. GOSPEL LETTERS
        // Fetch top 4 letters (1 Latest for display + 3 for list)
        const letters = await getGospelLetters(4);
        if (letters && letters.length > 0) {
            const latestLetterPage = letters[0];
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
                    snippet: snippet
                };
                messagesSummary.olderLetters = letters.slice(1);
            } catch (e) {
                console.error("Error fetching letter details", e);
                messagesSummary.latestLetter = latestLetterPage;
                messagesSummary.olderLetters = letters.slice(1);
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
