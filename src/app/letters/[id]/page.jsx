import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPage, getBlocks } from '../../../lib/notion';
import { buildGospelLetterPresentationData } from '../../../lib/transform/letterTransform';
import GospelLetterPresentation from '../../../components/messages/GospelLetterPresentation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

// Revalidate every hour
export const revalidate = 3600;

export default async function LetterPage({ params }) {
    const { id } = await params;
    let letter = null;

    try {
        const page = await getPage(id);
        if (!page) notFound();
        const blocks = await getBlocks(id);
        letter = buildGospelLetterPresentationData(page, blocks);
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
            <GospelLetterPresentation letter={letter} />
            <Footer />
        </div>
    );
}
