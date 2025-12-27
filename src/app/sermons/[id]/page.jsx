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

// Revalidate immediately for development
export const revalidate = 0;

export default async function SermonPage({ params }) {
    const { id } = await params;
    let sermon = null;
    let messagesSummary = null;

    try {
        const page = await getPage(id);
        if (!page) notFound();

        // 3. Resolve Content Logic (Hub -> Manuscript)
        // The Hub Page contains metadata (Media) but the Content Blocks are in the linked "Sermon" page.
        let contentPageId = id;
        let contentPage = null;
        const sermonRelation = page.properties?.['Sunday_DB']?.relation;
        if (sermonRelation && sermonRelation.length > 0) {
            contentPageId = sermonRelation[0].id;
            // Fetch linked page metadata for correct title
            try {
                contentPage = await getPage(contentPageId);
            } catch (err) {
                console.error("Failed to fetch linked content page", err);
            }
        }

        // Fetch blocks from the CONTENT ID (Manuscript), not the Hub ID
        const blocks = await getBlocks(contentPageId);
        sermon = buildSermonPresentationData(page, blocks, contentPage);

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
        <div className="min-h-screen bg-[#F4F3EF]">
            <Header siteSettings={siteSettings} />
            <SermonPresentation sermon={sermon} messagesSummary={messagesSummary} siteSettings={siteSettings}>
                <Footer siteSettings={siteSettings} />
            </SermonPresentation>
        </div>
    );
}
