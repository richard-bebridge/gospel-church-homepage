import { getSiteSettings } from '../lib/site-settings';
import HomePresentation from '../components/home/HomePresentation';

export const metadata = {
    title: 'Gospel Church',
    description: 'In the Word, We Rise.',
};

export default async function HomePage() {
    const siteSettings = await getSiteSettings();

    return (
        <HomePresentation siteSettings={siteSettings} />
    );
}
