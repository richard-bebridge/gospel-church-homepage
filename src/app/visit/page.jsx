import VisitPresentation from '../../components/visit/VisitPresentation';
import { getVisitContent } from '../../lib/visit-notion';
import { getSiteSettings } from '../../lib/site-settings';

export const metadata = {
    title: 'Visit | Gospel Church',
    description: 'Location and Worship Information of Gospel Church',
};

// Force dynamic rendering to ensure fresh data
export const revalidate = 0;

const VisitPage = async () => {
    const [sections, siteSettings] = await Promise.all([
        getVisitContent(),
        getSiteSettings()
    ]);

    return (
        <main className="w-full min-h-screen bg-[#F4F4F0]">
            <VisitPresentation sections={sections} siteSettings={siteSettings} />
        </main>
    );
};

export default VisitPage;
