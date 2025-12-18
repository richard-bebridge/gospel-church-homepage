import AboutPresentation from '../../components/about/AboutPresentation';
import { getAboutContent } from '../../lib/about-notion';
import { getSiteSettings } from '../../lib/site-settings';

export const metadata = {
    title: 'About | Gospel Church',
    description: 'Mission, Vision, and Values of Gospel Church',
};

// Force dynamic rendering to ensure fresh data
export const revalidate = 60;

const AboutPage = async () => {
    const [sections, siteSettings] = await Promise.all([
        getAboutContent(),
        getSiteSettings()
    ]);

    return (
        <main className="w-full min-h-screen bg-[#F4F4F0]">
            <AboutPresentation sections={sections} siteSettings={siteSettings} />
        </main>
    );
};

export default AboutPage;
