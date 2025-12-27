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

        // 3. Resolve Content Logic (Hub vs Manuscript)
        // Determine if 'id' is Hub (Sunday DB) or Manuscript (Sermon DB)
        let metaPage = page;    // Should point to Hub (for Metadata)
        let contentPage = page; // Should point to Manuscript (for Blocks)

        const sermonRelation = page.properties?.['Sermon_DB']?.relation; // Exists if page is Hub
        const sundayRelation = page.properties?.['Sunday_DB']?.relation; // Exists if page is Manuscript

        if (sermonRelation && sermonRelation.length > 0) {
            // Case A: Page is Hub. Fetch linked Manuscript for content.
            metaPage = page;
            const contentId = sermonRelation[0].id;
            try {
                contentPage = await getPage(contentId);
            } catch (err) {
                console.error("Failed to fetch linked content page", err);
            }
        } else if (sundayRelation && sundayRelation.length > 0) {
            // Case B: Page is Manuscript. Fetch linked Hub for metadata.
            contentPage = page;
            const hubId = sundayRelation[0].id;
            try {
                metaPage = await getPage(hubId);
            } catch (err) {
                console.error("Failed to fetch linked hub page", err);
            }
        }

        // Fetch blocks from the CONTENT ID (Manuscript)
        const blocks = await getBlocks(contentPage.id);
        sermon = buildSermonPresentationData(metaPage, blocks, contentPage);

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
