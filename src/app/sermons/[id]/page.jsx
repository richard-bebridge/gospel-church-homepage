import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPage, getBlocks } from '../../../lib/notion';
import { buildSermonPresentationData } from '../../../lib/transform/sermonTransform';
import { getMessagesSummary } from '../../../lib/data/getMessagesSummary';
import SermonPresentation from '../../../components/SermonPresentation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { getSiteSettings } from '../../../lib/site-settings';

// Revalidate every hour
export const revalidate = 3600;

export default async function SermonPage({ params }) {
    const { id } = await params;
    let sermon = null;
    let messagesSummary = null;

    try {
        const page = await getPage(id);
        if (!page) notFound();

        // 3. Resolve Content Logic (Hub -> Manuscript)
        // The Hub Page (Image 1) contains metadata (Media) but the Content Blocks are in the linked "Sermon" page (Image 2).
        let contentPageId = id;
        const sermonRelation = page.properties?.['Sermon']?.relation;
        if (sermonRelation && sermonRelation.length > 0) {
            contentPageId = sermonRelation[0].id;
        }

        // Fetch blocks from the CONTENT ID (Manuscript), not the Hub ID
        const blocks = await getBlocks(contentPageId);
        sermon = buildSermonPresentationData(page, blocks);

        // Fetch messages summary (passing current ID to exclude it)
        messagesSummary = await getMessagesSummary(id);

    } catch (e) {
        console.error("Error fetching sermon detail:", e);
        if (e.code === 'object_not_found' || e.status === 404) {
            notFound();
        }
        return (
            <div className="min-h-screen bg-[#F4F3EF] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Content Unavailable</h1>
                    <Link href="/sermons" className="text-[#2A4458] underline">
                        Back to Sermons
                    </Link>
                </div>
            </div>
        );
    }

    if (!sermon) notFound();

    const siteSettings = await getSiteSettings();

    return (
        <div className="min-h-screen bg-[#F4F3EF] flex flex-col">
            <Header siteSettings={siteSettings} />
            {/* Added pt-20 to match TestPage layout and prevent header overlap */}
            <main className="flex-grow pt-20">
                <SermonPresentation sermon={sermon} messagesSummary={messagesSummary} siteSettings={siteSettings}>
                    <Footer siteSettings={siteSettings} />
                </SermonPresentation>
            </main>
        </div>
    );
}
