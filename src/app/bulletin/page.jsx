import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getDatabase, getBlocks } from '../../lib/notion';
import { getSiteSettings } from '../../lib/site-settings';

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
                <p className="mb-8 text-xl md:text-2xl leading-loose text-[#05121C] font-pretendard font-light">
                    <Text text={value.rich_text} />
                </p>
            );
        case "heading_1":
            return (
                <h1 className="text-5xl md:text-6xl font-bold mt-20 mb-20 font-yisunshin text-[#05121C] uppercase tracking-tight">
                    <Text text={value.rich_text} />
                </h1>
            );
        case "heading_2":
            return (
                <h2 className="text-4xl font-bold mt-12 mb-12 font-yisunshin text-[#05121C] uppercase tracking-wide">
                    <Text text={value.rich_text} />
                </h2>
            );
        case "heading_3":
            return (
                <h3 className="text-3xl font-bold mt-6 mb-6 font-yisunshin text-gray-700">
                    <Text text={value.rich_text} />
                </h3>
            );
        case "bulleted_list_item":
            return (
                <li className="mb-4 ml-6 text-xl md:text-2xl leading-loose text-[#05121C] font-pretendard font-light list-disc">
                    <Text text={value.rich_text} />
                </li>
            );
        case "numbered_list_item":
            return (
                <li className="mb-4 ml-6 text-xl md:text-2xl leading-loose text-[#05121C] font-pretendard font-light list-decimal">
                    <Text text={value.rich_text} />
                </li>
            );
        case "to_do":
            return (
                <div className="flex gap-3 mb-4 items-start text-xl md:text-2xl leading-loose font-pretendard font-light">
                    <input type="checkbox" defaultChecked={value.checked} disabled className="mt-2 w-5 h-5" />
                    <span className={value.checked ? "line-through text-gray-400" : "text-[#05121C]"}>
                        <Text text={value.rich_text} />
                    </span>
                </div>
            );
        case "toggle":
            return (
                <details className="mb-4">
                    <summary className="cursor-pointer font-bold text-xl md:text-2xl leading-loose text-[#05121C] font-pretendard">
                        <Text text={value.rich_text} />
                    </summary>
                    <div className="pl-4 mt-2 text-gray-500 italic">
                        (Toggle content not fully supported in this view yet)
                    </div>
                </details>
            );
        case "image":
            const src = value.type === "external" ? value.external.url : value.file.url;
            const caption = value.caption ? value.caption[0]?.plain_text : "";
            return (
                <figure className="my-16 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
                    <img src={src} alt={caption} className="w-full h-auto object-cover" />
                    {caption && <figcaption className="text-center text-sm text-gray-500 mt-2">{caption}</figcaption>}
                </figure>
            );
        case "divider":
            return <hr className="my-16 border-gray-300" />;
        case "quote":
            return (
                <blockquote className="border-l-4 border-[#05121C] pl-6 py-4 my-12 text-gray-600 italic bg-[#F4F3EF] font-pretendard text-lg">
                    <Text text={value.rich_text} />
                </blockquote>
            );
        case "callout":
            return (
                <div className="p-4 my-4 bg-[#F4F3EF] rounded-lg border border-gray-200 flex gap-3 shadow-sm font-pretendard">
                    <div className="text-xl">{value.icon?.emoji}</div>
                    <div className="text-[#05121C] text-lg"><Text text={value.rich_text} /></div>
                </div>
            );
        default:
            return null;
    }
};

export default async function BulletinPage() {
    const databaseId = process.env.NOTION_SUNDAY_DB_ID;
    let error = null;
    const [siteSettings, bulletinData] = await Promise.all([
        getSiteSettings(),
        (async () => {
            if (!databaseId) return { page: null, blocks: [] };
            try {
                const pages = await getDatabase(databaseId);
                if (pages && pages.length > 0) {
                    const pageResult = pages[0];
                    const blocksResult = await getBlocks(pageResult.id);
                    return { page: pageResult, blocks: blocksResult };
                }
                return { page: null, blocks: [] };
            } catch (e) {
                const fetchError = "Failed to fetch bulletin data. Please check your Notion API Key and Database ID.";
                console.error(e);
                return { page: null, blocks: [], error: fetchError };
            }
        })()
    ]);

    const { page, blocks, error: fetchError } = bulletinData;
    if (fetchError) error = fetchError;

    return (
        <div className="min-h-screen bg-[#F4F3EF]">
            <Header siteSettings={siteSettings} />

            <div className="pt-40 pb-32 relative max-w-3xl mx-auto px-8 lg:px-0">
                {error ? (
                    <div className="p-8 bg-red-50 border border-red-200 rounded-lg text-center text-red-600">
                        <p className="font-bold mb-2">Connection Error</p>
                        <p>{error}</p>
                    </div>
                ) : !page ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-500">No bulletin found.</p>
                    </div>
                ) : (
                    <div className="w-full">
                        {/* Page Title */}
                        <h1 className="font-sans font-bold text-5xl md:text-6xl leading-[0.9] tracking-tighter text-[#05121C] uppercase mb-24 text-center">
                            {page.properties?.Name?.title?.[0]?.plain_text || "Untitled Bulletin"}
                        </h1>

                        {/* Blocks */}
                        <div className="space-y-2">
                            {blocks.map((block) => (
                                <div key={block.id}>{renderBlock(block)}</div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Footer siteSettings={siteSettings} />
        </div>
    );
}
