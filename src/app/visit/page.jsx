import VisitPresentation from '../../components/visit/VisitPresentation';
import { getVisitContent } from '../../lib/visit-notion';
import { getSiteSettings } from '../../lib/site-settings';

export const metadata = {
    title: '가스펠교회 방문하기 | 첫 방문 안내',
    description: '가스펠교회에 처음 오시는 분들을 위한 방문 안내입니다. 예배 시간, 위치, 교회 분위기와 방향성을 소개합니다.',
    alternates: {
        canonical: 'https://gospelchurch.kr/visit',
    },
    openGraph: {
        title: '가스펠교회 방문하기 | 첫 방문 안내',
        description: '가스펠교회에 처음 오시는 분들을 위한 방문 안내입니다. 예배 시간, 위치, 교회 분위기와 방향성을 소개합니다.',
        url: 'https://gospelchurch.kr/visit',
        siteName: 'Gospel Church',
        locale: 'ko_KR',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: '가스펠교회 방문하기 | 첫 방문 안내',
        description: '예배 시간, 위치, 교회 분위기와 방향성을 소개합니다.',
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
