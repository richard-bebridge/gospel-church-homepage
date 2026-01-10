import { getSiteSettings } from '../lib/site-settings';
import { getHomeContent } from '../lib/home-notion';
import HomePresentation from '../components/home/HomePresentation';

export const metadata = {
    title: 'Gospel Church | 말씀 안에서 일어서는 공동체',
    description: '가스펠교회는 말씀 안에서 하나님을 찾고, 그분 앞에서 새로워지는 사람들의 공동체입니다.',
    alternates: {
        canonical: 'https://gospelchurch.kr',
    },
    openGraph: {
        title: 'Gospel Church | 말씀 안에서 일어서는 공동체',
        description: '가스펠교회는 말씀 안에서 하나님을 찾고, 그분 앞에서 새로워지는 사람들의 공동체입니다.',
        url: 'https://gospelchurch.kr',
        siteName: 'Gospel Church',
        locale: 'ko_KR',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Gospel Church | 말씀 안에서 일어서는 공동체',
        description: '가스펠교회는 말씀 안에서 하나님을 찾고, 그분 앞에서 새로워지는 사람들의 공동체입니다.',
    },
};

export default async function HomePage() {
    const siteSettings = await getSiteSettings();
    const sections = await getHomeContent();

    return (
        <HomePresentation siteSettings={siteSettings} sections={sections} />
    );
}
