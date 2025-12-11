import React from 'react';
import GospelLetterPresentation from '../../components/messages/GospelLetterPresentation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getLatestGospelLetter } from '../../lib/gospel-notion';

// Force dynamic rendering to ensure fresh data from Notion on each request
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const GospelLetterPage = async () => {
    const letter = await getLatestGospelLetter();

    if (!letter) {
        return (
            <div className="min-h-screen bg-[#F4F3EF] flex flex-col items-center justify-center font-pretendard">
                <Header />
                <div className="text-center p-8">
                    <h1 className="text-2xl font-bold text-[#05121C] mb-4">No Letter Found</h1>
                    <p className="text-[#2A4458]">Please check back later.</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <>
            <Header />
            <GospelLetterPresentation letter={letter} />
            <Footer />
        </>
    );
};

export default GospelLetterPage;
