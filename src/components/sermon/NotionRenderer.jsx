'use client';

import React, { createContext, useContext, useMemo } from 'react';
import Image from 'next/image';
import { fastNormalize } from '../../lib/utils/textPipeline';
import { CURRENT_TEXT } from '../../lib/typography-tokens';

const RECURSION_LIMIT = 15;

// Context used to align column_list labels across a section
const TableAlignmentContext = createContext(null);

export const TableAlignmentProvider = ({ children, blocks }) => {
    const gridConfig = useMemo(() => {
        if (!blocks || blocks.length === 0) return { active: false };

        const hasColumnList = blocks.some(block => block.type === 'column_list' && block.children?.length >= 2);
        if (!hasColumnList) return { active: false };

        // Two-column grid: label + content
        return {
            active: true,
            template: 'minmax(160px, max-content) minmax(0, 1fr)'
        };
    }, [blocks]);

    if (!gridConfig.active) {
        return (
            <TableAlignmentContext.Provider value={gridConfig}>
                <div className="w-full">
                    {children}
                </div>
            </TableAlignmentContext.Provider>
        );
    }

    return (
        <TableAlignmentContext.Provider value={gridConfig}>
            <div
                className="grid w-full items-start"
                style={{
                    gridTemplateColumns: gridConfig.template,
                    columnGap: '2rem',
                    rowGap: '0px'
                }}
            >
                {children}
            </div>
        </TableAlignmentContext.Provider>
    );
};

const LinkIcon = () => (
    <span
        className="inline-flex items-center justify-center ml-1 text-[#2A4458] align-middle"
        style={{ transform: 'translateY(-2px)' }}
        aria-label="External link icon"
    >
        <svg
            width="1.2em"
            height="1.2em"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        >
            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </span>
);

const InlineAssetToken = ({ filename, sizeParam, scaleParam }) => {
    // Direct path usage from /public/assets
    const srcPath = `/assets/${filename}`;

    // "sizeParam" acts as the Box Size (default 32px)
    const boxSizeRaw = sizeParam || '32px';
    const boxSize = parseInt(boxSizeRaw) || 32;

    // "scaleParam" acts as Optical Correction (default 1)
    const scaleRaw = scaleParam || '1';
    const scale = parseFloat(scaleRaw.replace(/[^\d.]/g, '')) || 1;

    return (
        <span
            className="inline-flex items-center justify-center align-middle mx-1"
            style={{
                width: `${boxSize}px`,
                height: `${boxSize}px`
            }}
        >
            <Image
                src={srcPath}
                alt={filename}
                width={boxSize}
                height={boxSize}
                unoptimized
                className="object-contain"
                style={{
                    width: 'auto',
                    height: 'auto',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    transform: `scale(${scale})`
                }}
            />
        </span>
    );
};

const GalleryBlock = ({ items, size, gap }) => {
    const heightVal = Number(size) || 28;   // size = Logo Height
    const g = Number(gap) || 12;

    return (
        <div className="w-full overflow-x-auto no-scrollbar py-2">
            <div className="flex items-center w-max" style={{ gap: `${g}px` }}>
                {items.map((item, idx) => {
                    const srcPath = `/assets/${item.src}`;
                    const scale = item.scale || 1;

                    // Gallery Logic: Fixed Height, Auto Width (natural aspect ratio via img logic)
                    const LogoBox = (
                        <div className="shrink-0 relative flex items-center justify-center">
                            <Image
                                src={srcPath}
                                alt={item.src}
                                height={heightVal}
                                width={heightVal} // Placeholder, strict style controls dimensions
                                unoptimized
                                className="object-contain block transition-opacity hover:opacity-80"
                                style={{
                                    width: 'auto',
                                    height: `${heightVal}px`,
                                    transform: `scale(${scale})`
                                }}
                            />
                        </div>
                    );

                    return (
                        <div key={idx} className="shrink-0 p-1">
                            {item.link ? (
                                <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block cursor-pointer transition-transform hover:scale-105 active:scale-95 overflow-visible"
                                >
                                    {LogoBox}
                                </a>
                            ) : (
                                LogoBox
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// Helper to merge split text nodes if they contain reference tokens (**...**)
// This fixes issues where Notion splits text prevents regex matching
const mergeRichTextIfRefPresent = (richText) => {
    if (!richText || richText.length === 0) return richText;

    const fullText = richText.map(t => t.plain_text || t.text?.content || '').join('');

    // Only intervene if we see the ** pattern and there are NO links (to avoid breaking links)
    // and if there are multiple nodes (otherwise no need to merge)
    if (fullText.includes('**') && richText.length > 1) {
        const hasLinks = richText.some(t => t.text?.link || t.href);
        if (!hasLinks) {
            // Merge into single node to allow Regex to match the full token
            return [{
                type: 'text',
                text: { content: fullText, link: null },
                annotations: { // Reset annotations to allow cleaner parsing, or keep default
                    bold: false, italic: false, strikethrough: false,
                    underline: false, code: false, color: 'default'
                },
                plain_text: fullText,
                href: null
            }];
        }
    }
    return richText;
};

// Normalize Notion table cell rich_text so manual line breaks stay vertical instead of flowing into next grid column.
const normalizeCellRichText = (cellRichText = []) => {
    if (!Array.isArray(cellRichText) || cellRichText.length === 0) return cellRichText || [];

    return cellRichText.map((node, idx) => {
        if (!node?.text) return node;

        const originalContent = node.text.content ?? node.plain_text ?? '';
        const alreadyHasBreak = /\n\s*$/.test(originalContent);
        const shouldAppendBreak = idx < cellRichText.length - 1 && !alreadyHasBreak;

        if (!shouldAppendBreak) {
            return node;
        }

        const nextContent = `${originalContent}\n`;
        return {
            ...node,
            text: { ...node.text, content: nextContent },
            plain_text: (node.plain_text ?? originalContent) + '\n'
        };
    });
};

// Sub-component for rendering enriched text
const Text = ({ text, mounted = true }) => {
    if (!text || !mounted) return null;

    // 1. Merge all rich_text nodes into a single string to handle "split" newlines
    // This allows us to detect \n that might be at the end of one node or start of another
    // We must PRESERVE metadata (bold, link, color) so we map them to a structure first.
    // However, simply merging loses the styling boundaries.

    // BETTER STRATEGY: 
    // Notion usually provides \n inside the text content. 
    // If the user says "nodes are split", it implies [ {text:"Line1"}, {text:"Line2"} ].
    // If so, we can simply render them adjacently. <br> is only needed if \n is present.
    // BUT if the user wants implicit breaks between nodes, that's dangerous.

    // Let's assume the user is right that \n is present as a character or we need to respect whitespace.
    // The previous implementation processed each node individually.

    return text.map((value, i) => {
        const {
            annotations: { bold, code, color, italic, strikethrough, underline },
            text,
        } = value;

        // Custom styling classes
        const className = [
            (bold || text.link) ? "font-bold" : "",
            code ? "bg-gray-100 p-1 rounded font-mono text-sm" : "",
            italic ? "italic" : "",
            strikethrough ? "line-through" : "",
            underline ? "underline" : "",
        ].join(" ");

        const style = color !== "default" ? { color } : {};

        // CONTENT PROCESSING
        // 1. Normalize
        let content = fastNormalize(text.content);

        // 2. Handle literal \n if present (User report suggests this might happen)
        content = content.replace(/\\n/g, '\n');

        // 3. Highlight Logic (Refactored to support newlines)
        // We split by newline FIRST, then by keyword.
        // This ensures <br/> is inserted correctly.
        const lines = content.split('\n');

        return (
            <React.Fragment key={i}>
                {lines.map((line, lineIdx) => {
                    // Keyword Highlighting in this line
                    const HIGHLIGHT = /\b(seek|stand|transform|radiate)\b/gi;
                    const parts = line.split(HIGHLIGHT);

                    const renderedLine = parts.map((part, pIdx) => {
                        if (part.match(HIGHLIGHT)) {
                            return (
                                <span key={`hl-${i}-${lineIdx}-${pIdx}`} className={`font-english font-bold ${className}`} style={style}>
                                    {part}
                                </span>
                            );
                        }

                        // Handling Links (if the whole node is a link)
                        if (text.link || value.href) {
                            const url = text.link?.url || value.href;
                            // Remove existing arrow characters from Notion text to prevent duplicates
                            const cleanPart = part.replace(/[\u2197\u2B08\u2934\u21D7↗➚⬈]/g, '').trim();

                            // Skip empty parts entirely (prevents duplicate icons)
                            if (!cleanPart) return null;

                            return (
                                <a
                                    key={`lnk-${i}-${lineIdx}-${pIdx}`}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`group inline-flex items-center gap-1 ${CURRENT_TEXT.link_text} ${className} whitespace-pre-wrap`}
                                    style={style}
                                >
                                    {cleanPart}
                                    <LinkIcon />
                                </a>
                            );
                        }

                        return (
                            <span key={`txt-${i}-${lineIdx}-${pIdx}`} className={className} style={style}>
                                {part}
                            </span>
                        );
                    });

                    return (
                        <React.Fragment key={`line-${i}-${lineIdx}`}>
                            {renderedLine}
                            {lineIdx < lines.length - 1 && <br />}
                        </React.Fragment>
                    );
                })}
            </React.Fragment>
        );
    });
};

const NotionRenderer = ({ block, level = 0, bodyClass = '', columnIndex = null, isFirst = false, isLast = false, inheritedBorderColor = null, mounted = true }) => {
    if (level > RECURSION_LIMIT) {
        console.warn("[NotionRenderer] Recursion limit reached", block.id);
        return null;
    }
    const { type, [type]: value } = block;
    const gridConfig = useContext(TableAlignmentContext);

    // Helper to wrap blocks within grid layout for column_list sections
    const wrapGrid = (content, className = '') => {
        if (!gridConfig?.active) return content;

        // Level 0 blocks span the full width
        if (level === 0) {
            return (
                <div className={`col-span-full ${className}`}>
                    {content}
                </div>
            );
        }

        // Column blocks (level 1) occupy their allocated tracks
        if (type === 'column' && level === 1) {
            const isLabel = columnIndex === 0;

            return (
                <div className={`${className} border-t pt-3 ${isLabel ? 'font-bold' : ''}`}>
                    {block.children?.map((child, idx) => (
                        <NotionRenderer
                            key={child.id}
                            block={child}
                            level={level + 1}
                            bodyClass={bodyClass}
                            columnIndex={columnIndex}
                            isFirst={isFirst && idx === 0}
                            isLast={idx === block.children.length - 1}
                            mounted={mounted}
                        />
                    ))}
                </div>
            );
        }

        return content;
    };

    // Allow table, table_row, columns, and text types for recursive rendering
    if (!value?.rich_text &&
        type !== 'image' &&
        type !== 'table' &&
        type !== 'table_row' &&
        type !== 'text' &&
        type !== 'column_list' &&
        type !== 'column'
    ) return null;

    // 1. Gally DSL Parsing (Both Multi-line and Single-line)
    if (type === 'paragraph' && value.rich_text.length > 0) {
        const fullText = value.rich_text.map(t => t.plain_text).join('');

        // A. Multi-line [gallery ...]
        const multiLineStart = fullText.match(/^\[gallery\s+(.*?)\]/);
        if (multiLineStart) {
            const attrStr = multiLineStart[1];
            const size = (attrStr.match(/size=(\d+)/) || [])[1];
            const gap = (attrStr.match(/gap=(\d+)/) || [])[1];

            const contentMatch = fullText.match(/\]([\s\S]*?)\[\/gallery\]/);
            if (contentMatch) {
                const itemLines = contentMatch[1].trim().split('\n');
                const items = itemLines
                    .map(line => {
                        const cleanLine = line.replace(/^-\s*/, '').trim();
                        if (!cleanLine) return null;
                        const [srcRaw, link] = cleanLine.split('|').map(s => s.trim());

                        let src = srcRaw;
                        let scale = 1;
                        if (srcRaw.includes('::scale')) {
                            const parts = srcRaw.split('::scale');
                            src = parts[0];
                            const scaleStr = parts[1];
                            scale = parseFloat(scaleStr.replace(/[^\d.]/g, '')) || 1;
                        }

                        return { src: src.trim(), link, scale };
                    })
                    .filter(Boolean);

                return wrapGrid(<GalleryBlock items={items} size={size ? parseInt(size) : 24} gap={gap ? parseInt(gap) : 12} />, 'my-8');
            }
        }

        // B. Single-line [img_gallery_move_h ...]
        // Syntax: [img_gallery_move_h size::24px gap::12 items::src1@link1;src2]
        const singleLineMatch = fullText.match(/^\[img_gallery_move_h\s+(.*?)\]$/);
        if (singleLineMatch) {
            const attrStr = singleLineMatch[1];
            // Extract attributes using generic regex or specific
            const sizeMatch = attrStr.match(/size::(\d+)(?:px)?/);
            const gapMatch = attrStr.match(/gap::(\d+)/);
            const itemsMatch = attrStr.match(/items::(.*)/);

            const size = sizeMatch ? parseInt(sizeMatch[1]) : 24;
            const gap = gapMatch ? parseInt(gapMatch[1]) : 12;

            if (itemsMatch) {
                const itemsStr = itemsMatch[1];
                const items = itemsStr.split(';').map(itemStr => {
                    // Item: src@link or src
                    const [srcRaw, link] = itemStr.split('@').map(s => s.trim());

                    let src = srcRaw;
                    let scale = 1;
                    if (srcRaw.includes('::scale')) {
                        const parts = srcRaw.split('::scale');
                        src = parts[0];
                        const scaleStr = parts[1];
                        scale = parseFloat(scaleStr.replace(/[^\d.]/g, '')) || 1;
                    }

                    return { src: src.trim(), link, scale };
                }).filter(i => i.src);

                return wrapGrid(<GalleryBlock items={items} size={size} gap={gap} />, 'my-8');
            }
        }
    }

    if (type === 'image') {
        const url = value.type === 'external' ? value.external.url : value.file.url;
        return wrapGrid(
            <div className="relative w-full aspect-video my-8">
                <Image src={url} alt="Notion Image" fill className="object-cover rounded-lg" />
            </div>,
            'my-8'
        );
    }

    switch (type) {
        case 'table': {
            const rows = block.children || [];

            return wrapGrid(
                <div className="w-full max-w-[720px] mx-auto mt-6 mb-10">
                    <table className="table-auto w-full border-collapse text-left">
                        <tbody>
                            {rows.map((row, rIdx) => {
                                const cells = row.table_row?.cells || [];

                                return (
                                    <tr key={row.id} className="border-t border-gray-200">
                                        {cells.map((cell, cIdx) => {
                                            const normalized = normalizeCellRichText(cell);
                                            const tokenClass = cIdx === 0 ? CURRENT_TEXT.table_head : CURRENT_TEXT.table_cell;

                                            return (
                                                <td
                                                    key={cIdx}
                                                    className={`py-3 px-3 align-top break-words ${tokenClass}`}
                                                    style={{ whiteSpace: 'pre-wrap' }}
                                                >
                                                    <Text text={normalized} mounted={mounted} />
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>,
                'mb-8'
            );
        }
        case 'table_row': {
            const cells = value.cells || [];

            // table_row is only rendered within standard <table> elements
            // Grid-based rendering is no longer used for tables
            return (
                <tr className="border-t border-gray-200">
                    {cells.map((cell, cIdx) => {
                        const normalizedCell = normalizeCellRichText(cell);
                        const tokenClass = (cIdx === 0 ? CURRENT_TEXT.table_head : CURRENT_TEXT.table_cell) + ' whitespace-pre-wrap';

                        return (
                            <td
                                key={cIdx}
                                className={`py-3 align-top ${tokenClass}`}
                                style={{ whiteSpace: 'pre-wrap' }}
                            >
                                <Text text={normalizedCell} mounted={mounted} />
                            </td>
                        );
                    })}
                </tr>
            );
        }
        case 'paragraph':
            // Check for Block-Level Reference (entire paragraph wrapped in **)
            // This handles cases where Notion splits the text into multiple nodes preventing inline regex match
            const pFullText = value.rich_text.map(t => t.plain_text).join('').trim();
            const hasLinksInP = value.rich_text.some(t => t.text?.link || t.href);

            if (pFullText.startsWith('**') && pFullText.endsWith('**') && !hasLinksInP) {
                // [MAINTENANCE] BL03: Reference Text Styling (* 안내문구)
                // This handles text wrapped in ** ** in Notion. 
                // Currently set to bold Navy color with minimal margin.
                const content = pFullText.slice(2, -2).trim();
                return wrapGrid(
                    <p className={`!font-bold !text-[0.85em] text-[#2A4458] mb-1 ${CURRENT_TEXT.reference_text} ${bodyClass}`}>
                        * {content}
                    </p>,
                    'mt-0 mb-0'
                );
            }
            return wrapGrid(
                <p className={`mb-6 leading-relaxed break-keep ${bodyClass}`}>
                    <Text text={value.rich_text} mounted={mounted} />
                </p>,
                'mb-8'
            );
        case 'heading_1':
            return wrapGrid(<h1 className={CURRENT_TEXT.notion_h1}><Text text={value.rich_text} mounted={mounted} /></h1>, 'mb-8');
        case 'heading_2':
            // Removed hardcoded mt/mb to allow Token Control (via Typo Lab)
            return wrapGrid(<h2 className={CURRENT_TEXT.section_heading_ko}><Text text={value.rich_text} mounted={mounted} /></h2>, 'mb-8');
        case 'heading_3':
            return wrapGrid(<h3 className={CURRENT_TEXT.notion_h3}><Text text={value.rich_text} mounted={mounted} /></h3>, 'mb-8');
        case 'gallery':
            return wrapGrid(
                <GalleryBlock
                    items={value.items}
                    size={value.size}
                    gap={value.gap}
                />,
                'my-8'
            );
        case 'bulleted_list_item':
            return wrapGrid(
                <div className={`${CURRENT_TEXT.bullet_list} ${bodyClass} flex items-start gap-3 relative`}>
                    <div className="relative w-3 h-3 mt-2.5 shrink-0 select-none">
                        <Image
                            src="/assets/symbol.png"
                            alt="bullet"
                            fill // Using fill to match container
                            sizes="12px"
                            className="object-contain opacity-80"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <Text text={value.rich_text} />
                        {/* Recursive Children (Nested Lists) */}
                        {block.children && block.children.length > 0 && (
                            <div className="mt-2 flex flex-col gap-1">
                                {block.children.map(child => (
                                    <NotionRenderer
                                        key={child.id}
                                        block={child}
                                        level={level + 1}
                                        columnIndex={columnIndex}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>,
                'mb-2' // Reduced margin for list continuity
            );
        case 'numbered_list_item':
            return wrapGrid(<div className={`${CURRENT_TEXT.numbered_list} ${bodyClass}`} style={{ display: 'list-item' }}><Text text={value.rich_text} /></div>, 'mb-8');
        case 'quote':
            return wrapGrid(<blockquote className={`${CURRENT_TEXT.quote} ${bodyClass}`}><Text text={value.rich_text} mounted={mounted} /></blockquote>, 'mb-8');
        case 'callout':
            return wrapGrid(
                <div className={`${CURRENT_TEXT.callout} flex gap-4 ${bodyClass}`}>
                    {value.icon?.emoji && <span>{value.icon.emoji}</span>}
                    <div><Text text={value.rich_text} mounted={mounted} /></div>
                </div>,
                'mb-8'
            );
        case 'column_list': {
            const childCount = block.children?.length || 0;

            if (gridConfig?.active) {
                return (
                    <div className="contents">
                        {block.children?.map((child, idx) => (
                            <NotionRenderer
                                key={child.id}
                                block={child}
                                level={level + 1}
                                bodyClass={bodyClass}
                                columnIndex={idx}
                                mounted={mounted}
                            />
                        ))}
                    </div>
                );
            }
            return wrapGrid(
                <div
                    className="flex flex-col md:grid gap-8 w-full items-start"
                    style={{
                        gridTemplateColumns: childCount === 2 ? 'auto 1fr' : `repeat(${childCount}, 1fr)`
                    }}
                >
                    {block.children?.map(child => (
                        <NotionRenderer key={child.id} block={child} level={level + 1} bodyClass={bodyClass} />
                    ))}
                </div>,
                'mb-8'
            );
        }
        case 'column':
            if (gridConfig?.active) {
                return (
                    <div className="contents [&>*:first-child]:mt-0">
                        {block.children?.map(child => (
                            <NotionRenderer
                                key={child.id}
                                block={child}
                                level={level + 1}
                                bodyClass={bodyClass}
                                columnIndex={columnIndex}
                                mounted={mounted}
                            />
                        ))}
                    </div>
                );
            }
            return (
                <div className="w-full min-w-0 [&>*:first-child]:mt-0">
                    {block.children?.map(child => (
                        <NotionRenderer
                            key={child.id}
                            block={child}
                            level={level + 1}
                            bodyClass={bodyClass}
                            columnIndex={columnIndex}
                            mounted={mounted}
                        />
                    ))}
                </div>
            );
        default:
            return null;
    }
};

export default NotionRenderer;
