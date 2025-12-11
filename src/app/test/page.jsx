import React from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getDatabase, getBlocks } from '../../lib/notion';
import { getVerse, extractBibleTags } from '../../lib/bible';
import { getGospelLetters } from '../../lib/gospel-notion';

// Revalidate every hour
export const revalidate = 3600;

const Text = ({ text }) => {
    if (!text) {
        return null;
    }
    return text.map((value, i) => {
        const {
            annotations: { bold, code, color, italic, strikethrough, underline },
            text,
        } = value;
        return (
            <span
                key={i}
                className={[
                    bold ? "font-bold" : "",
                    code ? "bg-gray-100 p-1 rounded font-mono text-sm" : "",
                    italic ? "italic" : "",
                    strikethrough ? "line-through" : "",
                    underline ? "underline" : "",
                ].join(" ")}
                style={color !== "default" ? { color } : {}}
            >
                {text.link ? <a href={text.link.url} className="underline text-blue-600">{text.content}</a> : text.content}
            </span>
        );
    });
};

const renderBlock = (block) => {
    const { type, id } = block;
    const value = block[type];

    switch (type) {
        case "paragraph":
            return (
                <p className="mb-4 text-lg leading-relaxed text-[#05121C] font-pretendard">
                    <Text text={value.rich_text} />
                </p>
            );
        case "heading_1":
            return (
                <h1 className="text-3xl font-bold mt-8 mb-4 font-yisunshin text-[#05121C]">
                    <Text text={value.rich_text} />
                </h1>
            );
        case "heading_2":
            return (
                <h2 className="text-2xl font-bold mt-6 mb-3 font-yisunshin text-[#05121C]">
                    <Text text={value.rich_text} />
                </h2>
            );
        case "heading_3":
            return (
                <h3 className="text-xl font-bold mt-4 mb-2 font-yisunshin text-[#05121C]">
                    <Text text={value.rich_text} />
                </h3>
            );
        case "bulleted_list_item":
        case "numbered_list_item":
            return (
                <li className="mb-1 ml-4 text-lg leading-relaxed text-[#05121C] font-pretendard">
                    <Text text={value.rich_text} />
                </li>
            );
        case "to_do":
            return (
                <div className="flex gap-2 mb-2 items-start">
                    <input type="checkbox" defaultChecked={value.checked} disabled className="mt-1.5" />
                    <span className={value.checked ? "line-through text-gray-400" : ""}>
                        <Text text={value.rich_text} />
                    </span>
                </div>
            );
        case "toggle":
            return (
                <details className="mb-4">
                    <summary className="cursor-pointer font-bold">
                        <Text text={value.rich_text} />
                    </summary>
                    <div className="pl-4 mt-2 text-gray-500 italic">
                        (Toggle content not fully supported in this view yet)
                    </div>
                </details>
            );
        case "image":
            const src = value.type === "external" ? value.external.url : value.file.url;
            const caption = value.caption ? value.caption[0]?.plain_text : "";
            return (
                <figure className="my-8">
                    <img src={src} alt={caption} className="w-full rounded-lg shadow-sm" />
                    {caption && <figcaption className="text-center text-sm text-gray-500 mt-2">{caption}</figcaption>}
                </figure>
            );
        case "video":
            const videoUrl = value.type === "external" ? value.external.url : value.file.url;
            if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
                const videoId = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)?.[1];
                if (videoId) {
                    return (
                        <div className="w-full aspect-video my-8 rounded-lg overflow-hidden shadow-sm">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    )
                }
            }
            return (
                <div className="my-8">
                    <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Watch Video</a>
                </div>
            );
        case "column_list":
            return (
                <div className="flex flex-col md:flex-row gap-8 my-8 w-full">
                    {block.children?.map((child) => (
                        <div key={child.id} className="flex-1 min-w-0">
                            {renderBlock(child)}
                        </div>
                    ))}
                </div>
            );
        case "column":
            return (
                <div className="flex flex-col gap-4">
                    {block.children?.map((child) => (
                        <div key={child.id}>{renderBlock(child)}</div>
                    ))}
                </div>
            );
        case "divider":
            return <hr className="my-8 border-gray-200" />;
        case "quote":
            return (
                <blockquote className="border-l-4 border-[#05121C] pl-4 py-2 my-6 italic text-xl bg-gray-50 rounded-r">
                    <Text text={value.rich_text} />
                </blockquote>
            );
        case "bible_verse":
            return (
                <div className="my-6 p-6 bg-[#F8F9FA] rounded-lg border-l-4 border-[#5F94BD]">
                    <p className="text-lg text-[#05121C] font-serif leading-relaxed mb-4">
                        {value.text}
                    </p>
                    <p className="text-base text-[#5F94BD] font-bold text-right font-sans">
                        {value.reference}
                    </p>
                </div>
            );
        default:
            return null;
    }
};

// Helper to flatten blocks (remove columns/layout)
const flattenBlocks = (blocks) => {
    let flat = [];
    for (const block of blocks) {
        if (block.type === 'column_list' || block.type === 'column') {
            if (block.children) {
                flat = flat.concat(flattenBlocks(block.children));
            }
        } else {
            flat.push(block);
        }
    }
    return flat;
};

// Helper to process blocks and inject verses
const injectVerses = (blocks, seenTags) => {
    const newBlocks = [];

    for (const block of blocks) {
        // 1. Check for Heading -> Reset Scope
        if (block.type === 'heading_1' || block.type === 'heading_2' || block.type === 'heading_3') {
            seenTags.clear();
        }

        // 2. Extract text and find tags
        let richText = null;
        if (block.type === 'paragraph') richText = block.paragraph.rich_text;
        else if (block.type === 'heading_1') richText = block.heading_1.rich_text;
        else if (block.type === 'heading_2') richText = block.heading_2.rich_text;
        else if (block.type === 'heading_3') richText = block.heading_3.rich_text;
        else if (block.type === 'bulleted_list_item') richText = block.bulleted_list_item.rich_text;
        else if (block.type === 'numbered_list_item') richText = block.numbered_list_item.rich_text;
        else if (block.type === 'quote') richText = block.quote.rich_text;

        const versesToInject = [];

        if (richText) {
            richText.forEach(rt => {
                const text = rt.plain_text;
                const tags = extractBibleTags(text);

                tags.forEach(tag => {
                    if (!seenTags.has(tag.full)) {
                        seenTags.add(tag.full);
                        const verseText = getVerse(tag.book, tag.chapter, tag.verse);
                        if (verseText) {
                            versesToInject.push({
                                id: `verse-${tag.full}-${Math.random()}`,
                                type: 'bible_verse',
                                bible_verse: {
                                    tag: tag.full,
                                    text: verseText,
                                    reference: `${tag.book} ${tag.chapter}:${tag.verse}`
                                }
                            });

                            // Remove tag from text
                            if (rt.text) rt.text.content = rt.text.content.replace(tag.full, '');
                            rt.plain_text = rt.plain_text.replace(tag.full, '');
                        }
                    }
                });
            });
        }

        // Push original block (now potentially with tags removed)
        newBlocks.push(block);

        // Push injected verses
        versesToInject.forEach(v => newBlocks.push(v));
    }
    return newBlocks;
};

import SermonPresentation from '../../components/SermonPresentation';

// ... (previous imports and helper functions: Text, renderBlock, injectVerses)

// Helper to group blocks into sections
const groupSections = (blocks) => {
    const sections = [];
    let currentSection = { heading: null, content: [], verses: [] };

    blocks.forEach(block => {
        if (block.type === 'heading_1' || block.type === 'heading_2' || block.type === 'heading_3') {
            // Push previous section if it has content or verses
            if (currentSection.content.length > 0 || currentSection.verses.length > 0) {
                sections.push(currentSection);
            }
            // Start new section
            const headingText = block[block.type].rich_text.map(t => t.plain_text).join('');
            currentSection = { heading: headingText, content: [], verses: [] };
        } else if (block.type === 'bible_verse') {
            currentSection.verses.push(block.bible_verse);
        } else {
            // Add other blocks to content
            currentSection.content.push(block);
        }
    });

    // Push last section
    if (currentSection.content.length > 0 || currentSection.verses.length > 0) {
        sections.push(currentSection);
    }

    return sections;
};

export default async function TestPage() {
    const databaseId = process.env.NOTION_SERMON_DB_ID;
    const sundayDbId = process.env.NOTION_SUNDAY_DB_ID || process.env.NOTION_SUNDAY_DB;

    let page = null;
    let blocks = [];
    let sermons = [];
    let mediaLinks = { youtube: "", audio: "" };
    let error = null;
    let debugLog = {
        step: "Init",
        sundayDbId: sundayDbId ? "Found" : "Missing",
        apiKeyCheck: process.env.NOTION_API_KEY ? `Present (${process.env.NOTION_API_KEY.slice(0, 4)}...)` : "MISSING"
    };

    if (!databaseId) {
        error = "NOTION_SERMON_DB_ID is not set in .env file.";
    } else {
        try {
            // 1. Fetch the latest sermon from Content DB
            // Fetching a batch to sort by Date explicitly in JS
            sermons = await getDatabase(databaseId, {
                page_size: 20
            });

            // Sort by Date Descending in JS
            if (sermons && sermons.length > 0) {
                sermons.sort((a, b) => {
                    const dateA = a.properties?.Date?.date?.start || a.created_time;
                    const dateB = b.properties?.Date?.date?.start || b.created_time;
                    return new Date(dateB) - new Date(dateA);
                });
                page = sermons[0];
                blocks = await getBlocks(page.id);

                // 2. Fetch Media Links from Sunday Service DB
                if (sundayDbId) {
                    const services = await getDatabase(sundayDbId);
                    debugLog.servicesFetched = services.length;

                    if (services.length > 0) {
                        // Log property keys of first item to verify Schema
                        debugLog.firstItemKeys = Object.keys(services[0].properties);
                        // Dump first 5 services to check values
                        debugLog.candidateServices = services.slice(0, 5).map(s => ({
                            id: s.id,
                            dates: s.properties?.Date?.date?.start,
                            relationIds: s.properties?.Sermon?.relation?.map(r => r.id),
                            keys: Object.keys(s.properties)
                        }));
                    }

                    // Strict match by ID
                    let matchingService = services.find(service => {
                        const relations = service.properties?.Sermon?.relation || []; // Assuming property name is "Sermon" based on user image
                        return relations.some(r => r.id === page.id);
                    });

                    if (matchingService) {
                        debugLog.matchType = "Relation ID";
                    } else {
                        // Fallback 1: Match by Date
                        const sermonDate = page.properties?.Date?.date?.start;
                        if (sermonDate) {
                            matchingService = services.find(s => s.properties?.Date?.date?.start === sermonDate);
                            if (matchingService) {
                                debugLog.matchType = "Date";
                                debugLog.sermonDate = sermonDate;
                            }
                        }

                        // Fallback 2: Match by Title (Name)
                        if (!matchingService) {
                            const sermonTitle = page.properties?.Name?.title?.[0]?.plain_text;
                            if (sermonTitle) {
                                matchingService = services.find(s => {
                                    const serviceTitle = s.properties?.Name?.title?.[0]?.plain_text;
                                    return serviceTitle === sermonTitle;
                                });
                                if (matchingService) {
                                    debugLog.matchType = "Title";
                                    debugLog.matchedTitle = sermonTitle;
                                }
                            }
                        }
                    }

                    if (matchingService) {
                        const getMediaUrl = (prop) => {
                            if (!prop) return "";
                            if (prop.url) return prop.url;
                            if (prop.files && prop.files.length > 0) {
                                const fileObj = prop.files[0];
                                return fileObj.file?.url || fileObj.external?.url || "";
                            }
                            return "";
                        };

                        mediaLinks.youtube = getMediaUrl(matchingService.properties?.YouTube) || getMediaUrl(matchingService.properties?.Youtube);
                        mediaLinks.audio = getMediaUrl(matchingService.properties?.Sound) || getMediaUrl(matchingService.properties?.Audio);

                        // Also fill in missing metadata from Service DB if needed
                        if (!page.properties?.Date?.date?.start && matchingService.properties?.Date?.date?.start) {
                            page.properties.Date = matchingService.properties.Date;
                        }
                        if ((!page.properties?.Preacher?.rich_text?.[0]?.plain_text) && matchingService.properties?.Preacher) {
                            // Create a fake structure to match the accessor or just update the variable later
                            // Safer to just update the final object construction below
                        }
                    }
                }
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
        // DEBUG: Pass debug info to client
        debug: {
            sundayDbId: sundayDbId,
            foundServicesCount: 0,
            matchingServiceId: null,
            matchReason: null
        }
    };

    // --- MESSAGES SUMMARY DATA FETCHING ---
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
                // Simple snippet extraction: Find first paragraph logic or use flatten
                const flatLetter = flattenBlocks(letterBlocks);
                // Find first paragraph with content
                const firstPara = flatLetter.find(b => b.type === 'paragraph' && b.paragraph.rich_text.length > 0);
                const snippet = firstPara
                    ? firstPara.paragraph.rich_text.map(t => t.plain_text).join('')
                    : "";

                // For Letters, the "Latest" is the big one.
                // The list should show the NEXT 3.
                messagesSummary.latestLetter = {
                    ...latestLetterPage,
                    snippet: snippet
                };
                messagesSummary.olderLetters = letters.slice(1); // indices 1,2,3 (max 3 items)
            } catch (e) {
                console.error("Error fetching letter details", e);
                // Fallback without snippet
                messagesSummary.latestLetter = latestLetterPage;
                messagesSummary.olderLetters = letters.slice(1);
            }
        }

        // 2. SERMONS (Previous + Older)
        if (sermons && sermons.length > 0) {
            // Filter out current sermon by ID to avoid duplication
            // page.id is the current sermon ID
            const otherSermons = sermons.filter(s => s.id !== page.id);

            if (otherSermons.length > 0) {
                const prevSermonPage = otherSermons[0];
                try {
                    const prevSermonBlocks = await getBlocks(prevSermonPage.id);
                    const flatSermon = flattenBlocks(prevSermonBlocks);
                    const firstPara = flatSermon.find(b => b.type === 'paragraph' && b.paragraph.rich_text.length > 0);
                    const snippet = firstPara
                        ? firstPara.paragraph.rich_text.map(t => t.plain_text).join('')
                        : "";

                    messagesSummary.previousSermon = {
                        id: prevSermonPage.id,
                        title: prevSermonPage.properties?.Name?.title?.[0]?.plain_text || "Untitled",
                        date: prevSermonPage.properties?.Date?.date?.start || "",
                        snippet: snippet
                    };
                } catch (e) {
                    console.error("Error fetching sermon details", e);
                }

                // Older sermons: We want 3 items in the list.
                // otherSermons[0] is used for "previousSermon" (Big).
                // So we need indices 1, 2, 3.
                // slice(1, 4) gives indices 1, 2, 3.
                messagesSummary.olderSermons = otherSermons.slice(1, 4).map(s => ({
                    id: s.id,
                    title: s.properties?.Name?.title?.[0]?.plain_text || "Untitled",
                    date: s.properties?.Date?.date?.start || ""
                }));
            }
        }
    } catch (e) {
        console.error("Error fetching summary data", e);
    }

    return (
        <div className="min-h-screen bg-[#F4F3EF] flex flex-col">
            <Header />
            <main className="flex-grow pt-20">
                <SermonPresentation sermon={sermonData} messagesSummary={messagesSummary}>
                    <Footer />
                </SermonPresentation>
            </main>
        </div>
    );
}
