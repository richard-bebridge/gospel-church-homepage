'use server';

import LayoutLabClient from './LayoutLabClient';
import { getHomeContent } from '../../lib/home-notion';

export default async function LayoutLabPage() {
    // Fetch sections to display names
    const sections = await getHomeContent();

    return (
        <LayoutLabClient sections={sections} />
    );
}
