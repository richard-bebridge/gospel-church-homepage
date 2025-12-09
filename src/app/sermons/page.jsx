import React from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getDatabase } from '../../lib/notion';

// Revalidate every hour
export const revalidate = 3600;

export default async function SermonPage() {
    const databaseId = process.env.NOTION_SERMON_DB_ID;
    let sermons = [];
    let error = null;

    if (!databaseId) {
        error = "NOTION_SERMON_DB_ID is not set in .env file.";
    } else {
        try {
            sermons = await getDatabase(databaseId);
        } catch (e) {
            error = "Failed to fetch sermons. Please check your Notion API Key and Database ID.";
            console.error(e);
        }
    }

    return (
        <div className="min-h-screen bg-[#F4F3EF]">
            <Header />

            <main className="pt-32 pb-20 px-6 sm:px-8 lg:px-24 min-h-screen">
                <div className="max-w-6xl mx-auto">
                    <h1 className="font-sans font-bold text-4xl sm:text-5xl md:text-6xl mb-12 text-[#05121C] uppercase tracking-tight">
                        Sermons
                    </h1>

                    {/* Figma Embed - Keeping this as requested previously, maybe move it or keep it as featured? 
                        For now, I'll keep it at the top as a "Featured Sketch" or similar if desired, 
                        but let's focus on the list first. I'll leave it out for now to focus on the list, 
                        or put it below. Let's put it below the list for now.
                    */}

                    {error ? (
                        <div className="p-8 bg-red-50 border border-red-200 rounded-lg text-center text-red-600 mb-12">
                            <p className="font-bold mb-2">Connection Error</p>
                            <p>{error}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                            {sermons.length === 0 ? (
                                <p className="text-gray-500 col-span-full">No sermons found.</p>
                            ) : (
                                sermons.map((sermon) => {
                                    const title = sermon.properties?.Name?.title?.[0]?.plain_text || "Untitled Sermon";
                                    const date = sermon.properties?.Date?.date?.start || "No Date";
                                    const preacher = sermon.properties?.Preacher?.rich_text?.[0]?.plain_text || "";
                                    const scripture = sermon.properties?.Scripture?.rich_text?.[0]?.plain_text || "";

                                    // Assuming there might be a YouTube link property, or we just link to detail
                                    // For now, link to detail page (which we need to create if we want full content)
                                    // Or if it's just a video link, we could link out.
                                    // Let's assume detail page for now.

                                    return (
                                        <Link href={`/sermons/${sermon.id}`} key={sermon.id} className="group">
                                            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 h-full flex flex-col hover:shadow-md transition-all hover:-translate-y-1 duration-300">
                                                {/* Placeholder for thumbnail if we have one */}
                                                <div className="aspect-video bg-gray-200 flex items-center justify-center text-gray-400">
                                                    <span className="text-4xl">▶</span>
                                                </div>

                                                <div className="p-6 flex-1 flex flex-col">
                                                    <p className="text-sm text-[#5F94BD] font-bold mb-2 uppercase tracking-wide">{date}</p>
                                                    <h2 className="text-xl font-bold text-[#05121C] font-yisunshin mb-3 group-hover:text-[#5F94BD] transition-colors line-clamp-2">
                                                        {title}
                                                    </h2>
                                                    {scripture && <p className="text-sm text-gray-500 font-serif mb-1">{scripture}</p>}
                                                    {preacher && <p className="text-sm text-gray-400 font-mono mt-auto">{preacher}</p>}
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })
                            )}
                        </div>
                    )}

                    {/* Original Figma Embed (Optional - keeping it as it was in the previous file) */}
                    <div className="mt-20">
                        <h3 className="text-2xl font-bold text-[#05121C] mb-6">Sermon Sketch</h3>
                        <div className="w-full aspect-video bg-white rounded-lg shadow-lg overflow-hidden">
                            <iframe
                                style={{ border: '1px solid rgba(0, 0, 0, 0.1)' }}
                                width="100%"
                                height="100%"
                                src="https://embed.figma.com/design/pF5tKbJvQcjhJ20Eze0fRS/Sketch-book?node-id=4153-4949&embed-host=share"
                                allowFullScreen
                                title="Sermon Sketch"
                            />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
