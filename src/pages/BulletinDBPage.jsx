import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import bulletinDbData from '../data/bulletinDb.json';

// Helper to get block text
const getText = (block) => {
    if (!block.properties?.title) return null;
    return block.properties.title.map(item => {
        const [text, decorations] = item;
        if (!decorations) return text;

        // Simple decoration handling
        return decorations.reduce((acc, deco) => {
            const [type] = deco;
            if (type === 'b') return <strong key={text}>{acc}</strong>;
            if (type === 'i') return <em key={text}>{acc}</em>;
            if (type === 'a') return <a key={text} href={deco[1]} className="underline text-blue-600">{acc}</a>;
            return acc;
        }, text);
    });
};

const BlockRenderer = ({ block, blockMap }) => {
    const type = block.value?.type;
    const properties = block.value?.properties;
    const content = block.value?.content;

    if (!type) return null;

    // Recursive rendering for children
    const children = content?.map(id => {
        const childBlock = blockMap[id];
        if (!childBlock) return null;
        return <BlockRenderer key={id} block={childBlock} blockMap={blockMap} />;
    });

    switch (type) {
        case 'page':
        case 'header':
            return (
                <h1 className="text-5xl md:text-6xl font-bold text-[#05121C] mb-20 mt-20 font-yisunshin tracking-tight uppercase">
                    {getText(block.value)}
                </h1>
            );
        case 'sub_header':
            return (
                <h2 className="text-4xl font-bold text-[#05121C] mb-12 mt-12 font-yisunshin uppercase tracking-wide">
                    {getText(block.value)}
                </h2>
            );
        case 'sub_sub_header':
            return (
                <h3 className="text-3xl font-bold text-gray-700 mb-6 mt-6 font-yisunshin">
                    {getText(block.value)}
                </h3>
            );
        case 'text':
            const text = getText(block.value);
            if (!text) return <div className="h-8" />; // Empty line
            return (
                <p className="text-[#05121C] leading-loose mb-8 font-pretendard text-xl md:text-2xl font-light">
                    {text}
                </p>
            );
        case 'bulleted_list':
            return (
                <li className="text-[#05121C] leading-loose mb-4 font-pretendard ml-6 list-disc font-light text-xl md:text-2xl">
                    {getText(block.value)}
                    {children && <ul className="mt-4">{children}</ul>}
                </li>
            );
        case 'numbered_list':
            return (
                <li className="text-[#05121C] leading-loose mb-4 font-pretendard ml-6 list-decimal font-light text-xl md:text-2xl">
                    {getText(block.value)}
                    {children && <ol className="mt-4">{children}</ol>}
                </li>
            );
        case 'image':
            const source = properties?.source?.[0]?.[0];
            // Simple hack for public images:
            const imageUrl = `https://www.notion.so/image/${encodeURIComponent(source)}?table=block&id=${block.value.id}&cache=v2`;

            return (
                <div className="my-16 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
                    <img src={imageUrl} alt="Bulletin Image" className="w-full h-auto object-cover" />
                </div>
            );
        case 'divider':
            return <hr className="border-gray-300 my-16" />;
        case 'quote':
            return (
                <blockquote className="border-l-4 border-[#05121C] pl-6 py-4 my-12 text-gray-600 italic bg-[#F4F3EF] font-pretendard text-lg">
                    {getText(block.value)}
                </blockquote>
            );
        case 'callout':
            return (
                <div className="p-4 my-4 bg-[#F4F3EF] rounded-lg border border-gray-200 flex gap-3 shadow-sm font-pretendard">
                    <div className="text-xl">{block.value.format?.page_icon}</div>
                    <div className="text-[#05121C]">{getText(block.value)}</div>
                </div>
            );
        case 'collection_view_page':
        case 'collection_view':
            // For DB views, we need to find the collection and its rows
            const collectionId = block.value.collection_id;
            const viewId = block.value.view_ids?.[0];

            if (!collectionId || !viewId) return null;

            // In notion-client response, 'collection' holds schema, 'collection_view' holds view info
            // The actual rows are usually in the 'block' map as children of the view or queried separately.
            // However, notion-client's getPage usually returns the blocks if they are loaded.
            // Let's check if the view block has content (row IDs).

            // If the block has content (row IDs), render them
            if (block.value.content) {
                return (
                    <div className="space-y-12 mt-12">
                        {block.value.content.map(rowId => {
                            const rowBlock = blockMap[rowId];
                            if (!rowBlock) return null;

                            // Render each row as a card or item
                            // Assuming rows are pages themselves
                            return (
                                <div key={rowId} className="border-b border-gray-300 pb-12">
                                    <h3 className="text-3xl font-bold text-[#05121C] mb-4 font-yisunshin">
                                        {getText(rowBlock.value)}
                                    </h3>
                                    {/* Render properties if needed, or just the title */}
                                    {/* If the row page has content, we could render it, but usually DB view just shows properties */}
                                    {/* For now, let's just render the title as a link or header */}
                                </div>
                            );
                        })}
                    </div>
                );
            }
            return null;

        default:
            console.log('Unknown block type:', type);
            return null;
    }
};

const BulletinDBPage = () => {
    const blockMap = bulletinDbData.block;
    // Find the root page block (collection view page)
    const pageId = Object.keys(blockMap).find(id => blockMap[id].value.type === 'collection_view_page');
    const pageBlock = blockMap[pageId];

    if (!pageBlock) return <div className="text-[#05121C] bg-[#F4F3EF] min-h-screen flex items-center justify-center">Loading...</div>;

    // Logic to find rows in the collection
    // Rows are blocks where type is 'page' and parent_id is the collection_id
    const collectionId = pageBlock.value.collection_id;
    const rowIds = Object.keys(blockMap).filter(id => {
        const block = blockMap[id];
        return block.value && block.value.type === 'page' && block.value.parent_id === collectionId;
    });

    // Sort rows if needed (e.g. by created_time descending) - Optional
    // For now, we rely on the order they appear or just render them. 
    // Notion usually returns them in some order, but explicit sorting might be needed later.

    return (
        <div className="min-h-screen bg-[#F4F3EF]">
            <Header />
            <div className="pt-40 pb-32 relative max-w-3xl mx-auto">
                {/* Content Area */}
                <div className="w-full bg-[#F4F3EF]">
                    <div className="px-8 lg:px-0">
                        {/* Page Title */}
                        <h1 className="font-sans font-bold text-5xl md:text-6xl leading-[0.9] tracking-tighter text-[#05121C] uppercase mb-24 text-center">
                            {getText(pageBlock.value)}
                        </h1>

                        {/* Render each row as a Bulletin Item */}
                        <div className="space-y-32">
                            {rowIds.map(rowId => {
                                const rowBlock = blockMap[rowId];
                                const contentIds = rowBlock.value.content || [];
                                const title = getText(rowBlock.value);
                                const date = rowBlock.value.properties?.['Ro|N']?.[0]?.[1]?.[0]?.[1]?.start_date; // Extract date if available

                                return (
                                    <article key={rowId} className="bulletin-item">
                                        {/* Row Header */}
                                        <div className="mb-16 text-center">
                                            {date && (
                                                <div className="text-sm font-mono text-gray-400 mb-4 tracking-widest uppercase">
                                                    {date}
                                                </div>
                                            )}
                                            <h2 className="text-4xl font-bold text-[#05121C] font-yisunshin mb-8">
                                                {title}
                                            </h2>
                                            <div className="w-12 h-1 bg-[#05121C] mx-auto opacity-20"></div>
                                        </div>

                                        {/* Row Content */}
                                        <div className="space-y-12">
                                            {contentIds.map(id => {
                                                const block = blockMap[id];
                                                if (!block) return null;
                                                return <BlockRenderer key={id} block={block} blockMap={blockMap} />;
                                            })}
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </div>

                    {/* Footer inside flow */}
                    <div className="px-8 lg:px-12 xl:px-0 mt-32">
                        <hr className="border-gray-300 my-12" />
                        <p className="text-sm text-gray-500 font-mono uppercase tracking-widest text-center">
                            Gospel Church Bulletin DB
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default BulletinDBPage;
