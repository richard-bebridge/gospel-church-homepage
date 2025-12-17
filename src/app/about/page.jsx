import React from 'react';
import AboutPresentation from '../../components/about/AboutPresentation';
import { getAboutContent } from '../../lib/about-notion';

export const metadata = {
    title: 'About | Gospel Church',
    description: 'Mission, Vision, and Values of Gospel Church',
};

// Force dynamic rendering to ensure fresh data
export const revalidate = 60;

const AboutPage = async () => {
    const sections = await getAboutContent();

    return (
        <main className="w-full min-h-screen bg-[#F4F4F0]">
            <AboutPresentation sections={sections} />
        </main>
    );
};

export default AboutPage;
