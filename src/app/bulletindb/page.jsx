import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getDatabase } from '../../lib/notion';
import { getSiteSettings } from '../../lib/site-settings';

// Revalidate every hour
export const revalidate = 3600;

export default async function BulletinDBPage() {
    const databaseId = process.env.NOTION_SUNDAY_DB_ID;
    let error = null;

    const [bulletins, siteSettings] = await Promise.all([
        (async () => {
            if (!databaseId) return [];
            try {
                return await getDatabase(databaseId);
            } catch (e) {
                error = "Failed to fetch bulletins. Please check your Notion API Key and Database ID.";
                console.error(e);
                return [];
            }
        })(),
        getSiteSettings()
    ]);

    return (
        <div className="min-h-screen bg-[#F4F3EF]">
            <Header siteSettings={siteSettings} />

            <main className="pt-32 pb-20 px-6 sm:px-8 lg:px-24 min-h-screen">
                <div className="max-w-4xl mx-auto">
                    <h1 className="font-sans font-bold text-4xl sm:text-5xl md:text-6xl mb-12 text-[#05121C] uppercase tracking-tight text-center">
                        Bulletin Archive
                    </h1>

                    {error ? (
                        <div className="p-8 bg-red-50 border border-red-200 rounded-lg text-center text-red-600">
                            <p className="font-bold mb-2">Connection Error</p>
                            <p>{error}</p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {bulletins.length === 0 ? (
                                <p className="text-center text-gray-500">No bulletins found.</p>
                            ) : (
                                bulletins.map((bulletin) => {
                                    const title = bulletin.properties?.Name?.title?.[0]?.plain_text || "Untitled Bulletin";
                                    const date = bulletin.properties?.Date?.date?.start || "No Date";

                                    // We can reuse the same detail page as the main bulletin page if we modify it to accept an ID,
                                    // OR we can create a specific route like /bulletindb/[id].
                                    // Since /bulletin/page.jsx currently fetches the *latest*, 
                                    // let's create a dynamic route /bulletin/[id] to view any specific bulletin.
                                    // But wait, the current /bulletin is a single page. 
                                    // Let's link to /bulletin/[id] and we will create that page next.

                                    return (
                                        <Link href={`/bulletin/${bulletin.id}`} key={bulletin.id} className="block group">
                                            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group-hover:-translate-y-1 duration-300">
                                                <div>
                                                    <h2 className="text-xl sm:text-2xl font-bold text-[#05121C] font-yisunshin group-hover:text-[#5F94BD] transition-colors">
                                                        {title}
                                                    </h2>
                                                </div>
                                                <div className="text-sm text-gray-400 font-mono whitespace-nowrap bg-gray-50 px-3 py-1 rounded">
                                                    {date}
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>
            </main>

            <Footer siteSettings={siteSettings} />
        </div>
    );
}
