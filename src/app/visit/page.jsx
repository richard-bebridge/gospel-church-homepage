import VisitPresentation from '../../components/visit/VisitPresentation';
import { getVisitContent } from '../../lib/visit-notion';
import { getSiteSettings } from '../../lib/site-settings';

export const metadata = {
    title: 'Visit | Gospel Church',
    description: '예배 시간, 위치, 방문 안내. 가스펠교회를 처음 찾는 분들을 위한 정보입니다.',
    alternates: {
        canonical: 'https://gospelchurch.kr/visit',
    },
    openGraph: {
        title: 'Visit | Gospel Church',
        description: '예배 시간, 위치, 방문 안내. 가스펠교회를 처음 찾는 분들을 위한 정보입니다.',
        url: 'https://gospelchurch.kr/visit',
        siteName: 'Gospel Church',
        locale: 'ko_KR',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Visit | Gospel Church',
        description: '예배 시간, 위치, 방문 안내. 가스펠교회를 처음 찾는 분들을 위한 정보입니다.',
    },
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
