import React from 'react';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { getPage, getBlocks } from '../../../lib/notion';

// Revalidate every hour
export const revalidate = 3600;

const Text = ({ text }) => {
    if (!text) {
        return null;
    }
    return text.map((value, i) => {
        const {
            annotations: { bold, code, color, italic, strikethrough, underline },
            text,
        } = value;
        return (
            <span
                key={i}
                className={[
                    bold ? "font-bold" : "",
                    code ? "bg-gray-100 p-1 rounded font-mono text-sm" : "",
                    italic ? "italic" : "",
                    strikethrough ? "line-through" : "",
                    underline ? "underline" : "",
                ].join(" ")}
                style={color !== "default" ? { color } : {}}
            >
                {text.link ? <a href={text.link.url} className="underline text-blue-600">{text.content}</a> : text.content}
            </span>
        );
    });
};

const renderBlock = (block) => {
    const { type, id } = block;
    const value = block[type];

    switch (type) {
        case "paragraph":
            return (
                <p className="mb-4 text-lg leading-relaxed text-[#05121C] font-pretendard">
                    <Text text={value.rich_text} />
                </p>
            );
        case "heading_1":
            return (
                <h1 className="text-3xl font-bold mt-8 mb-4 font-yisunshin text-[#05121C]">
                    <Text text={value.rich_text} />
                </h1>
            );
        case "heading_2":
            return (
                <h2 className="text-2xl font-bold mt-6 mb-3 font-yisunshin text-[#05121C]">
                    <Text text={value.rich_text} />
                </h2>
            );
        case "heading_3":
            return (
                <h3 className="text-xl font-bold mt-4 mb-2 font-yisunshin text-[#05121C]">
                    <Text text={value.rich_text} />
                </h3>
            );
        case "bulleted_list_item":
        case "numbered_list_item":
            return (
                <li className="mb-1 ml-4 text-lg leading-relaxed text-[#05121C] font-pretendard">
                    <Text text={value.rich_text} />
                </li>
            );
        case "to_do":
            return (
                <div className="flex gap-2 mb-2 items-start">
                    <input type="checkbox" defaultChecked={value.checked} disabled className="mt-1.5" />
                    <span className={value.checked ? "line-through text-gray-400" : ""}>
                        <Text text={value.rich_text} />
                    </span>
                </div>
            );
        case "toggle":
            return (
                <details className="mb-4">
                    <summary className="cursor-pointer font-bold">
                        <Text text={value.rich_text} />
                    </summary>
                    {/* Note: Children blocks need recursive fetching/rendering which is complex for a simple example. 
                        For now, we just show the summary. */}
                    <div className="pl-4 mt-2 text-gray-500 italic">
                        (Toggle content not fully supported in this view yet)
                    </div>
                </details>
            );
        case "child_page":
            return <p className="mb-4 font-bold text-blue-600">{value.title} (Child Page)</p>;
        case "image":
            const src = value.type === "external" ? value.external.url : value.file.url;
            const caption = value.caption ? value.caption[0]?.plain_text : "";
            return (
                <figure className="my-8">
                    <img src={src} alt={caption} className="w-full rounded-lg shadow-sm" />
                    {caption && <figcaption className="text-center text-sm text-gray-500 mt-2">{caption}</figcaption>}
                </figure>
            );
        case "divider":
            return <hr className="my-8 border-gray-200" />;
        case "quote":
            return (
                <blockquote className="border-l-4 border-[#05121C] pl-4 py-2 my-6 italic text-xl bg-gray-50 rounded-r">
                    <Text text={value.rich_text} />
                </blockquote>
            );
        default:
            return <p className="text-gray-400 text-sm py-2">Unsupported block type: {type}</p>;
    }
};

export default async function LetterPage({ params }) {
    const { id } = await params;
    let page, blocks;

    try {
        page = await getPage(id);
        blocks = await getBlocks(id);
    } catch (error) {
        console.error("Error fetching letter:", error);
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Failed to load letter.</p>
            </div>
        );
    }

    if (!page || !blocks) {
        return <div />;
    }

    const title = page.properties?.Name?.title?.[0]?.plain_text || "Untitled";
    const date = page.properties?.Date?.date?.start || "";

    return (
        <div className="min-h-screen bg-[#F4F3EF]">
            <Header />

            <main className="pt-32 pb-20 px-6 sm:px-8 lg:px-24 min-h-screen">
                <article className="max-w-3xl mx-auto bg-white p-8 sm:p-12 md:p-16 rounded-lg shadow-sm border border-gray-100">
                    <Link href="/letters" className="inline-block mb-8 text-sm font-bold text-gray-400 hover:text-[#05121C] transition-colors uppercase tracking-wide">
                        ← Back to Letters
                    </Link>

                    <header className="mb-12 border-b border-gray-100 pb-8">
                        <h1 className="font-yisunshin font-bold text-3xl sm:text-4xl md:text-5xl mb-4 text-[#05121C] leading-tight">
                            {title}
                        </h1>
                        {date && <p className="text-gray-400 font-mono text-sm">{date}</p>}
                    </header>

                    <div className="space-y-2">
                        {blocks.map((block) => (
                            <div key={block.id}>{renderBlock(block)}</div>
                        ))}
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
}
