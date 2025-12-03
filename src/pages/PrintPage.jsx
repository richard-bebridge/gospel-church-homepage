import React from 'react';
import printPart1Data from '../data/printPart1.json';
import printPart2Data from '../data/printPart2.json';

// Helper to get block text (reused)
const getText = (block) => {
    if (!block || !block.properties?.title) return null;
    return block.properties.title.map(item => {
        const [text, decorations] = item;
        if (!decorations) return text;
        return decorations.reduce((acc, deco) => {
            const [type] = deco;
            if (type === 'b') return <strong key={text}>{acc}</strong>;
            if (type === 'i') return <em key={text}>{acc}</em>;
            if (type === 'a') return <a key={text} href={deco[1]} className="underline text-blue-600">{acc}</a>;
            return acc;
        }, text);
    });
};

// Auto-fit Wrapper Component
const AutoFitContent = ({ children }) => {
    const containerRef = React.useRef(null);
    const contentRef = React.useRef(null);

    React.useLayoutEffect(() => {
        const container = containerRef.current;
        const content = contentRef.current;
        if (!container || !content) return;

        // Reset scaling first
        content.style.transform = 'scale(1)';
        content.style.width = '100%';

        const containerHeight = container.clientHeight;
        const contentHeight = content.scrollHeight;

        if (contentHeight > containerHeight) {
            // Calculate scale needed to fit
            const scale = containerHeight / contentHeight;
            // Cap the scaling to avoid becoming too small (e.g., 0.7)
            const safeScale = Math.max(scale, 0.6);

            content.style.transformOrigin = 'top left';
            content.style.transform = `scale(${safeScale})`;
            content.style.width = `${(1 / safeScale) * 100}%`; // Increase width to compensate for scale
        }
    }, [children]);

    return (
        <div ref={containerRef} className="flex-1 overflow-hidden w-full">
            <div ref={contentRef}>
                {children}
            </div>
        </div>
    );
};

// Simple Block Renderer for Print with Site Design Language
const PrintBlockRenderer = ({ block, blockMap, ratio = { left: 'w-[67%]', right: 'w-[33%]' } }) => {
    const type = block.value?.type;
    const content = block.value?.content;

    // Recursive rendering
    const children = content?.map(id => {
        const childBlock = blockMap[id];
        if (!childBlock) return null;
        return <PrintBlockRenderer key={id} block={childBlock} blockMap={blockMap} ratio={ratio} />;
    });

    switch (type) {
        case 'header':
            return <h1 className="text-2xl font-bold mb-4 mt-6 font-yisunshin text-[#05121C]">{getText(block.value)}</h1>;
        case 'sub_header':
            return <h2 className="text-xl font-bold mb-3 mt-4 font-yisunshin text-[#05121C]">{getText(block.value)}</h2>;
        case 'sub_sub_header':
            return <h3 className="text-lg font-bold mb-2 mt-3 font-yisunshin text-gray-700">{getText(block.value)}</h3>;
        case 'text':
            const text = getText(block.value);
            if (!text) return <div className="h-4" />;
            return <p className="text-sm leading-relaxed mb-2 font-pretendard text-[#05121C] text-justify">{text}</p>;
        case 'bulleted_list':
            return <li className="text-sm leading-relaxed mb-1 font-pretendard ml-4 list-disc text-[#05121C]">{getText(block.value)}{children && <ul className="mt-1">{children}</ul>}</li>;
        case 'numbered_list':
            return <li className="text-sm leading-relaxed mb-1 font-pretendard ml-4 list-decimal text-[#05121C]">{getText(block.value)}{children && <ol className="mt-1">{children}</ol>}</li>;
        case 'image':
            const source = block.value?.properties?.source?.[0]?.[0];
            const imageUrl = `https://www.notion.so/image/${encodeURIComponent(source)}?table=block&id=${block.value.id}&cache=v2`;
            return <img src={imageUrl} alt="Print Image" className="w-full h-auto my-4 rounded grayscale-0" />;
        case 'column_list':
            // Custom rendering for columns to enforce ratio if there are exactly 2 columns
            const cols = content || [];
            if (cols.length === 2) {
                return (
                    <div className="flex gap-6 my-2">
                        <div className={`${ratio.left} min-w-0`}>
                            {blockMap[cols[0]] && <PrintBlockRenderer block={blockMap[cols[0]]} blockMap={blockMap} ratio={ratio} />}
                        </div>
                        <div className={`${ratio.right} min-w-0`}>
                            {blockMap[cols[1]] && <PrintBlockRenderer block={blockMap[cols[1]]} blockMap={blockMap} ratio={ratio} />}
                        </div>
                    </div>
                );
            }
            return <div className="flex gap-6 my-2">{children}</div>;
        case 'column':
            // Fallback for non-special columns
            return <div className="flex-1 min-w-0">{children}</div>;
        case 'divider':
            return <hr className="border-gray-300 my-4" />;
        case 'quote':
            return <blockquote className="pl-4 py-2 my-4 text-[10px] font-pretendard bg-[#F4F3EF] leading-relaxed break-words">{getText(block.value)}</blockquote>;
        case 'callout':
            return <div className="p-3 my-3 bg-[#F4F3EF] rounded border border-gray-200 text-[10px] flex gap-2 font-pretendard"><div className="shrink-0">{block.value.format?.page_icon}</div> <div>{getText(block.value)}</div></div>;
        default:
            return null;
    }
};

// A5 Page Component with Auto-fit
const Page = ({ pageNumber, children, className = "" }) => {
    return (
        <div className={`w-[148mm] h-[210mm] bg-white text-[#05121C] p-8 relative overflow-hidden flex flex-col ${className}`}>
            {/* Page Content Wrapper with Auto-fit */}
            <AutoFitContent>
                <div className="[&>*:first-child]:mt-0">
                    {children}
                </div>
            </AutoFitContent>

            {/* Page Number */}
            <div className="absolute bottom-6 left-0 right-0 text-center text-xs font-pretendard text-gray-400">
                - {pageNumber} -
            </div>
        </div>
    );
};

// A4 Sheet Component
const Sheet = ({ leftPage, rightPage }) => {
    return (
        <div className="w-[297mm] h-[210mm] bg-white flex shadow-lg print:shadow-none mb-8 print:mb-0 print:break-after-page mx-auto">
            {leftPage}
            {rightPage}
        </div>
    );
};

const PrintPage = () => {
    // Data Mapping
    // Part 1: Pages 1, 2, 3, 6, 7, 8
    const map1 = printPart1Data.block;
    const root1 = Object.values(map1).find(b => b.value.type === 'page')?.value;
    const content1 = root1?.content || [];

    // Part 2: Pages 4, 5
    const map2 = printPart2Data.block;
    const root2 = Object.values(map2).find(b => b.value.type === 'page')?.value;
    const content2 = root2?.content || [];
    // Ensure title is extracted from the page block value
    const title2 = getText(root2) || root2?.properties?.title?.[0]?.[0];
    // Given the ambiguity, I will render the FULL content of Link 1 into a scrollable/overflow hidden container for now,
    // OR better, just render specific blocks if I could identify them.

    // Let's try to just render the content linearly into the assigned pages.
    // Since we can't easily "flow" text across divs in React/Web, 
    // I will render the entire content of Link 1 into Page 1, and let it overflow? No, that's bad.

    // Strategy:
    // Page 1: Title of Link 1 + First few blocks?
    // This is tricky without manual "page breaks" in Notion.
    // I will render the content of Link 1 into a generic "Content Source" and try to slice it?
    // No, that's too complex.

    // Alternative:
    // Just render the Title of Link 1 on Page 1.
    // Render the Title of Link 2 on Page 4.
    // And put the blocks in.

    // Let's assume the user has organized the Notion page with headings like "Page 1", "Page 2"...
    // If not, I will just dump the content of Link 1 into Page 1 (and let it clip), Link 2 into Page 4...


    console.log('PrintPage Debug:', {
        root1: !!root1,
        content1Len: content1.length,
        root2: !!root2,
        content2Len: content2.length,
        title2
    });

    const renderBlocks = (ids, map, ratio) => ids.map(id => {
        const block = map[id];
        if (!block) return null;
        return <PrintBlockRenderer key={id} block={block} blockMap={map} ratio={ratio} />;
    });

    // For now, I will put ALL content of Link 1 into Page 1's slot, but it will overflow.
    // I'll add a note that content flow requires manual splitting or specific structure.

    // Actually, let's try to split by "Divider" block if present?
    // Or just put Part 1 content in Page 1, 2, 3...

    // Let's just render the raw content for now into the respective "start" pages
    // and see how it looks.

    // Ratios
    const ratio21 = { left: 'w-[67%]', right: 'w-[33%]' }; // 2:1
    const ratio31 = { left: 'w-[75%]', right: 'w-[25%]' }; // 3:1

    return (
        <div className="min-h-screen bg-gray-200 print:bg-white p-8 print:p-0 flex flex-col items-center">
            {/* Sheet 1 Front: Page 8 | Page 1 */}
            <Sheet
                leftPage={<Page pageNumber={8} className="border-r border-dashed border-gray-200">{renderBlocks(content1.slice(15, 17), map1)}</Page>}
                rightPage={<Page pageNumber={1}>
                    {renderBlocks(content1.slice(0, 3), map1)}
                </Page>}
            />

            {/* Sheet 1 Back: Page 2 | Page 7 */}
            <Sheet
                leftPage={<Page pageNumber={2} className="border-r border-dashed border-gray-200">{renderBlocks(content1.slice(3, 6), map1)}</Page>}
                rightPage={<Page pageNumber={7}>{renderBlocks(content1.slice(12, 15), map1)}</Page>}
            />

            {/* Sheet 2 Front: Page 6 | Page 3 */}
            <Sheet
                leftPage={<Page pageNumber={6} className="border-r border-dashed border-gray-200">{renderBlocks(content1.slice(9, 12), map1, ratio31)}</Page>}
                rightPage={<Page pageNumber={3}>{renderBlocks(content1.slice(6, 9), map1, ratio31)}</Page>}
            />

            {/* Sheet 2 Back: Page 4 | Page 5 */}
            <Sheet
                leftPage={<Page pageNumber={4} className="border-r border-dashed border-gray-200">
                    {title2 && <h1 className="text-2xl font-bold mb-6 font-yisunshin text-[#05121C] text-center break-keep">{title2}</h1>}
                    {renderBlocks(content2.slice(0, 4), map2, ratio21)}
                </Page>}
                rightPage={<Page pageNumber={5}>{renderBlocks(content2.slice(4), map2, ratio21)}</Page>}
            />

            <div className="print:hidden fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded shadow-lg text-sm">
                Press Cmd+P to Print (Landscape)
            </div>
        </div>
    );
};

export default PrintPage;
