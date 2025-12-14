import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPage, getBlocks } from '../../../lib/notion';
import { buildGospelLetterPresentationData } from '../../../lib/transform/letterTransform';
import GospelLetterPresentation from '../../../components/messages/GospelLetterPresentation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

import { getMessagesSummary } from '../../../lib/data/getMessagesSummary';

// Revalidate every hour
export const revalidate = 3600;

export default async function LetterPage({ params }) {
    const { id } = await params;
    let letter = null;
    let messagesSummary = null;

    try {
        const page = await getPage(id);
        if (!page) notFound();
        const blocks = await getBlocks(id);
        letter = buildGospelLetterPresentationData(page, blocks);

        // Fetch summary (pass current letter ID to exclude it if needed, though for letters we exclude by ID in getGospelLetters usually)
        // Actually getMessagesSummary logic for letters uses getGospelLetters.
        // We might want to pass the current ID to exclude it from "Older Letters"?
        // Looking at getMessagesSummary.js: 
        // 1. Fetches top 4 letters. 
        // 2. Latest = letters[0]. Older = letters.slice(1).
        // It doesn't explicitely exclude the *current* ID passed to the function unless we modify it.
        // But for now, let's just fetch it.
        // Fetch summary (pass current letter ID to exclude it)
        messagesSummary = await getMessagesSummary(null, id);
        // Wait, if I am viewing the Latest Letter, I don't want it to appear again in "Letters" section?
        // The "Letters" section shows "Latest Letter" (large) and "Older Letters" list.
        // If I am on the Latest Letter page, the summary section will show... the same Latest Letter?
        // Yes, that seems to be the design in Sermon page too. 
        // Let's stick to default behavior.

    } catch (e) {
        console.error("Error fetching letter detail:", e);
        if (e.code === 'object_not_found' || e.status === 404) {
            notFound();
        }
        return (
            <div className="min-h-screen bg-[#F4F3EF] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Content Unavailable</h1>
                    <Link href="/letters" className="text-[#2A4458] underline">
                        Back to Letters
                    </Link>
                </div>
            </div>
        );
    }

    if (!letter) notFound();

    return (
        <div className="bg-[#F4F3EF]">
            <Header />
            <GospelLetterPresentation letter={letter} messagesSummary={messagesSummary}>
                <Footer />
            </GospelLetterPresentation>
        </div>
    );
}
