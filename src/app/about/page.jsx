import AboutPresentation from '../../components/about/AboutPresentation';
import { getAboutContent } from '../../lib/about-notion';
import { getSiteSettings } from '../../lib/site-settings';

export const metadata = {
    title: 'About | Gospel Church',
    description: '가스펠교회의 비전, 신앙의 방향, 그리고 우리가 추구하는 공동체의 모습.',
    alternates: {
        canonical: 'https://gospelchurch.kr/about',
    },
    openGraph: {
        title: 'About | Gospel Church',
        description: '가스펠교회의 비전, 신앙의 방향, 그리고 우리가 추구하는 공동체의 모습.',
        url: 'https://gospelchurch.kr/about',
        siteName: 'Gospel Church',
        locale: 'ko_KR',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'About | Gospel Church',
        description: '가스펠교회의 비전, 신앙의 방향, 그리고 우리가 추구하는 공동체의 모습.',
    },
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
