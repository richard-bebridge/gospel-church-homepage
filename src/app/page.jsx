import { getSiteSettings } from '../lib/site-settings';
import { getHomeContent } from '../lib/home-notion';
import HomePresentation from '../components/home/HomePresentation';

export const metadata = {
    title: 'Gospel Church',
    description: 'In the Word, We Rise.',
};

export default async function HomePage() {
    const siteSettings = await getSiteSettings();
    const sections = await getHomeContent();

    return (
        <HomePresentation siteSettings={siteSettings} sections={sections} />
    );
}
