import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import bulletinData from '../data/bulletin.json';

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
        default:
            console.log('Unknown block type:', type);
            return null;
    }
};

const BulletinPage = () => {
    const blockMap = bulletinData.block;
    const pageId = Object.keys(blockMap).find(id => blockMap[id].value.type === 'page');
    const pageBlock = blockMap[pageId];

    if (!pageBlock) return <div className="text-[#05121C] bg-[#F4F3EF] min-h-screen flex items-center justify-center">Loading...</div>;

    const contentIds = pageBlock.value.content;

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

                        {/* Blocks */}
                        <div className="space-y-12">
                            {contentIds.map(id => {
                                const block = blockMap[id];
                                if (!block) return null;
                                return <BlockRenderer key={id} block={block} blockMap={blockMap} />;
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default BulletinPage;
