import AboutPresentation from '../../components/about/AboutPresentation';
import { getAboutContent } from '../../lib/about-notion';
import { getSiteSettings } from '../../lib/site-settings';

export const metadata = {
    title: '가스펠교회 소개 | 복음으로 연결된 공동체',
    description: '가스펠교회는 지역에 제한되지 않고 복음으로 연결된 공동체입니다. 우리는 말씀을 따라 배우며, 삶 속에서 하나님을 드러내는 교회입니다.',
    alternates: {
        canonical: 'https://gospelchurch.kr/about',
    },
    openGraph: {
        title: '가스펠교회 소개 | 복음으로 연결된 공동체',
        description: '가스펠교회는 지역에 제한되지 않고 복음으로 연결된 공동체입니다. 우리는 말씀을 따라 배우며, 삶 속에서 하나님을 드러내는 교회입니다.',
        url: 'https://gospelchurch.kr/about',
        siteName: 'Gospel Church',
        locale: 'ko_KR',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: '가스펠교회 소개 | 복음으로 연결된 공동체',
        description: '가스펠교회는 지역에 제한되지 않고 복음으로 연결된 공동체입니다. 우리는 말씀을 따라 배우며, 삶 속에서 하나님을 드러내는 교회입니다.',
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
