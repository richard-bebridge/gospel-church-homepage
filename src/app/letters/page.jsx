import React from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getDatabase } from '../../lib/notion';

// Revalidate every hour
export const revalidate = 3600;

export default async function LettersPage() {
    const databaseId = process.env.NOTION_GOSPEL_DB_ID;
    let letters = [];
    let error = null;

    if (!databaseId) {
        error = "NOTION_GOSPEL_DB_ID is not set in .env file.";
    } else {
        try {
            letters = await getDatabase(databaseId);
        } catch (e) {
            error = "Failed to fetch data. Please check your Notion API Key and Database ID.";
            console.error(e);
        }
    }

    return (
        <div className="min-h-screen bg-[#F4F3EF]">
            <Header />

            <main className="pt-32 pb-20 px-6 sm:px-8 lg:px-24 min-h-screen">
                <div className="max-w-4xl mx-auto">
                    <h1 className="font-sans font-bold text-4xl sm:text-5xl md:text-6xl mb-12 text-[#05121C] uppercase tracking-tight text-center">
                        Gospel Letters
                    </h1>

                    {error ? (
                        <div className="p-8 bg-red-50 border border-red-200 rounded-lg text-center text-red-600">
                            <p className="font-bold mb-2">Connection Error</p>
                            <p>{error}</p>
                            <p className="text-sm mt-4 text-gray-500">
                                Please make sure you have created a <code>.env</code> file with <code>NOTION_API_KEY</code> and <code>NOTION_GOSPEL_DB_ID</code>.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-8">
                            {letters.length === 0 ? (
                                <p className="text-center text-gray-500">No letters found.</p>
                            ) : (
                                letters.map((letter) => {
                                    // Adjust property names based on your actual Notion DB schema
                                    const title = letter.properties?.Name?.title?.[0]?.plain_text || "Untitled";
                                    const date = letter.properties?.Date?.date?.start || "No Date";

                                    return (
                                        <Link href={`/letters/${letter.id}`} key={letter.id} className="block group">
                                            <div className="bg-white p-8 rounded-lg shadow-sm group-hover:shadow-md transition-all border border-gray-100 group-hover:-translate-y-1 duration-300">
                                                <p className="text-sm text-gray-400 font-mono mb-2">{date}</p>
                                                <h2 className="text-2xl font-bold text-[#05121C] font-yisunshin group-hover:text-[#5F94BD] transition-colors">{title}</h2>
                                            </div>
                                        </Link>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
