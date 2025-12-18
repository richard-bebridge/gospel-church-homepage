import React, { createContext, useContext, useMemo } from 'react';
import Image from 'next/image';

// Context to synchronize table column alignments across a section/panel
const TableAlignmentContext = createContext(null);

export const TableAlignmentProvider = ({ children, blocks }) => {
    const gridConfig = useMemo(() => {
        if (!blocks || blocks.length === 0) return { active: false };

        const getDeepMaxTableWidth = (block) => {
            let max = 0;
            if (block.type === 'table') {
                max = block.table?.table_width || 0;
            }
            if (block.children) {
                block.children.forEach(child => {
                    max = Math.max(max, getDeepMaxTableWidth(child));
                });
            }
            return max;
        };

        let maxC1 = 0;
        let maxC2 = 0;
        blocks.forEach(block => {
            if (block.type === 'column_list' && block.children?.length >= 2) {
                maxC1 = Math.max(maxC1, 1);
                // Standard 2-column layout: Col 1 is Label, Col 2 is Content
                maxC2 = Math.max(maxC2, getDeepMaxTableWidth(block.children[1]));
            } else if (block.type === 'table') {
                maxC2 = Math.max(maxC2, getDeepMaxTableWidth(block));
            }
        });

        if (maxC1 === 0 && maxC2 === 0) return { active: false };

        // c1 is label track, c2 are content tracks
        const c1 = maxC1 || 1;
        const c2 = Math.max(maxC2, 1);
        const total = c1 + c2;

        const template = maxC1 >
            0 ? `fit-content(480px) repeat(${c2}, 1fr)`
            : `repeat(${total}, 1fr)`;

        return { active: true, c1, c2, maxCols: total, template };
    }, [blocks]);

    return (
        <TableAlignmentContext.Provider value={gridConfig}>
            <div
                className="grid w-full items-start"
                style={{
                    gridTemplateColumns: gridConfig.active ? gridConfig.template : 'none',
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

// Sub-component for rendering enriched text
const Text = ({ text }) => {
    if (!text) return null;

    // Pre-process: Merge nodes if needed to fix ** formatting
    const processedText = mergeRichTextIfRefPresent(text);

    return processedText.map((value, i) => {
        const {
            annotations: { bold, code, color, italic, strikethrough, underline },
            text,
        } = value;


        // Token Parsing: $$filename.png [::size] [::scale(n)]
        // Example: $$logo.png::32px::scale(1.2)
        // We split by "::" to handle flexible ordering/absence
        if (text.content.trim().startsWith('$$')) {
            const parts = text.content.split('::').map(s => s.trim());
            const firstPart = parts[0];
            const tokenMatch = firstPart.match(/^\s*\$\$\s*(.+?)\s*$/);

            if (tokenMatch) {
                const filename = tokenMatch[1];
                let sizeParam = null;
                let scaleParam = null;

                // Parse remaining parts
                for (let j = 1; j < parts.length; j++) {
                    const part = parts[j];
                    if (part.startsWith('scale(')) {
                        scaleParam = part;
                    } else {
                        // Assume it's size if not scale
                        sizeParam = part;
                    }
                }

                const token = (
                    <InlineAssetToken
                        key={i}
                        filename={filename}
                        sizeParam={sizeParam}
                        scaleParam={scaleParam}
                    />
                );

                if (text.link) {
                    return (
                        <a
                            key={i}
                            href={text.link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center hover:opacity-80 transition-opacity"
                        >
                            {token}
                        </a>
                    );
                }

                return token;
            }
        }

        // Custom Reference Parsing: **text** -> Small Bold Reference
        // Relaxed regex to capture content including newlines
        const refMatch = text.content.match(/\*\*([\s\S]*?)\*\*/);
        if (refMatch) {
            const parts = text.content.split(/(\*\*[\s\S]*?\*\*)/g);
            const refContent = parts.map((part, pIdx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    const content = part.slice(2, -2);
                    return (
                        <span key={`${i}-${pIdx}`} className="font-bold text-[0.85em] text-[#2A4458] align-top">
                            * {content}
                        </span>
                    );
                }
                return <span key={`${i}-${pIdx}`}>{part}</span>;
            });

            if (text.link) {
                return (
                    <a
                        key={i}
                        href={text.link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group font-bold hover:opacity-80 transition-opacity`}
                        style={style}
                    >
                        {refContent}
                        <LinkIcon />
                    </a>
                );
            }
            return refContent;
        }

        // Standard Annotation
        const className = [
            (bold || text.link) ? "font-bold" : "",
            code ? "bg-gray-100 p-1 rounded font-mono text-sm" : "",
            italic ? "italic" : "",
            strikethrough ? "line-through" : "",
            underline ? "underline" : "",
        ].join(" ");

        const style = color !== "default" ? { color } : {};

        if (text.link || value.href) {
            const url = text.link?.url || value.href;
            return (
                <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group inline-flex items-center gap-1 ${className} text-[#5F94BD] hover:opacity-80 transition-opacity whitespace-nowrap`}
                    style={style}
                >
                    <span className={className}>{text.content}</span>
                    <LinkIcon />
                </a>
            );
        }

        return (
            <span
                key={i}
                className={className}
                style={style}
            >
                {text.content}
            </span>
        );
    });
};

const NotionRenderer = ({ block, level = 0, bodyClass = '', columnIndex = null, isFirst = false, isLast = false, inheritedBorderColor = null }) => {
    const { type, [type]: value } = block;
    const gridConfig = useContext(TableAlignmentContext);

    // Helper to wrap blocks in grid span
    const wrapGrid = (content, className = '') => {
        if (!gridConfig?.active) return content;

        // Standalone blocks (level 0) span the full width
        if (level === 0) {
            return (
                <div className={`col-span-full ${className}`}>
                    {content}
                </div>
            );
        }

        // Column blocks (level 1) occupy their allocated tracks
        if (type === 'column' && level === 1) {
            let start = 1;
            let span = 1;

            if (columnIndex === 0) {
                start = 1;
                span = gridConfig.c1;
            } else if (columnIndex === 1) {
                start = gridConfig.c1 + 1;
                span = gridConfig.c2;
            }

            // [MAINTENANCE] BL01: Baseline Alignment Logic
            // This pt-3 (12px) determines the starting Y-position of all content within columns.
            // If you feel labels and content are misaligned, ensure this matches the padding on the first block.
            const isLabel = columnIndex === 0;
            const topPaddingClass = 'pt-3';

            // Custom Border Color (e.g. "Parking" section in Visit Page)
            // Default to gray-200. Inherit if provided by column_list
            let borderColor = inheritedBorderColor || '#E5E7EB';
            const firstChild = block.children?.[0];
            const firstRichText = firstChild?.[firstChild.type]?.rich_text;
            if (isLabel && firstRichText?.[0]?.annotations?.color) {
                const colorToken = firstRichText[0].annotations.color;
                if (colorToken.includes('red') || colorToken.includes('orange')) {
                    borderColor = '#E86452'; // GC Accent Red/Orange
                } else if (colorToken.includes('blue')) {
                    borderColor = '#2A4458'; // GC Dark Blue
                }
            }

            return (
                <div
                    className={`${className} border-t ${topPaddingClass} ${isLabel ? 'font-bold' : ''}`}
                    style={{
                        gridColumn: `${start} / span ${span}`,
                        borderTopColor: borderColor
                    }}
                >
                    {block.children?.map((child, idx) => (
                        <NotionRenderer
                            key={child.id}
                            block={child}
                            level={level + 1}
                            bodyClass={bodyClass}
                            columnIndex={columnIndex}
                            isFirst={isFirst && idx === 0}
                            isLast={idx === block.children.length - 1}
                            inheritedBorderColor={inheritedBorderColor}
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
            const rowCount = block.children?.length || 0;
            const firstRow = block.children?.[0];
            const colCount = firstRow?.table_row?.cells?.length || 0;

            // If we have a shared grid context, use it
            if (gridConfig?.active) {
                return (
                    <div className="contents">
                        {block.children?.map((child, idx) => (
                            <NotionRenderer
                                key={child.id}
                                block={child}
                                level={level + 1}
                                bodyClass={bodyClass}
                                columnIndex={columnIndex}
                                isFirst={isFirst && idx === 0}
                                isLast={isLast && idx === block.children.length - 1}
                            />
                        ))}
                    </div>
                );
            }

            // Fallback to legacy fixed column widths if no context
            // Note: Added mb-8 for spacing at the end of tables
            let colWidths = [];
            if (colCount === 2) colWidths = ['w-[30%]', 'w-[70%]'];
            else if (colCount === 3) colWidths = ['w-[20%]', 'w-[20%]', 'w-[60%]'];
            else if (colCount === 4) colWidths = ['w-[15%]', 'w-[15%]', 'w-[15%]', 'w-[55%]'];

            return (
                <div className={`w-full overflow-x-auto ${gridConfig?.active ? 'mt-0' : 'mt-8'} mb-16`}>
                    <table className="w-full border-collapse text-left border-t border-gray-200 table-fixed">
                        {colWidths.length > 0 && (
                            <colgroup>
                                {colWidths.map((w, idx) => (
                                    <col key={idx} className={w} />
                                ))}
                            </colgroup>
                        )}
                        <tbody>
                            {block.children?.map((child) => (
                                <NotionRenderer key={child.id} block={child} level={level + 1} bodyClass={bodyClass} />
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }
        case 'table_row': {
            const cells = value.cells || [];
            const cellCount = cells.length || 0;

            if (gridConfig?.active) {
                return (
                    <div className="contents">
                        {cells.map((cell, cIdx) => {
                            const _isLastItem = cIdx === cellCount - 1;
                            const isMeta = cIdx > 0 && !_isLastItem;

                            // Adjust padding: pb-3 for first, py-3 for middle, pb-8 for last row if section ends
                            const hasBorder = !isFirst;
                            const paddingClass = isFirst ? 'pb-3' : (isLast ? 'pt-3 pb-8' : 'py-3');

                            return (
                                <div
                                    key={cIdx}
                                    className={`${hasBorder ? 'border-t' : ''} border-gray-200 ${paddingClass} px-1 text-sm font-korean
                                        ${_isLastItem ? 'text-right opacity-80' : 'text-left'}
                                        ${isMeta ? 'opacity-60 font-light' : ''}
                                    `}
                                    style={{
                                        gridColumnStart: (columnIndex === 1 ? gridConfig.c1 : 0) + cIdx + 1,
                                        gridColumnEnd: 'span 1'
                                    }}
                                >
                                    {_isLastItem ? (
                                        <div className="flex justify-end">
                                            <Text text={cell} />
                                        </div>
                                    ) : (
                                        <Text text={cell} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                );
            }

            return (
                <tr className="border-t border-gray-200">
                    {cells.map((cell, cIdx) => {
                        const _isLastItem = cIdx === cellCount - 1;
                        const isMeta = cIdx > 0 && !_isLastItem;
                        return (
                            <td
                                key={cIdx}
                                className={`py-3 px-1 text-sm font-korean
                                    ${_isLastItem ? 'text-right opacity-80' : 'text-left'}
                                    ${isMeta ? 'opacity-60 font-light' : ''}
                                    ${bodyClass}
                                `}
                            >
                                <Text text={cell} />
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
                    <p className={`!font-bold !text-[0.85em] text-[#2A4458] mb-1 ${bodyClass}`}>
                        * {content}
                    </p>,
                    'mt-0 mb-0'
                );
            }
            return wrapGrid(
                <p className={`mb-6 leading-relaxed break-keep ${bodyClass}`}>
                    <Text text={value.rich_text} />
                </p>,
                'mb-8'
            );
        case 'heading_1':
            return wrapGrid(<h1 className="text-3xl font-bold mt-4 mb-2"><Text text={value.rich_text} /></h1>, 'mb-8');
        case 'heading_2':
            return wrapGrid(<h2 className="text-2xl font-medium font-korean mt-3 mb-2"><Text text={value.rich_text} /></h2>, 'mb-8');
        case 'heading_3':
            return wrapGrid(<h3 className="text-xl font-medium font-korean mt-2 mb-1"><Text text={value.rich_text} /></h3>, 'mb-8');
        case 'bulleted_list_item':
            // Logic for sub-bullet size (Half size if level > 0)
            const isSubBullet = level > 0;
            const bulletSizeClass = isSubBullet ? "w-1.5 h-1.5 mt-[0.6em]" : "w-3 h-3 mt-[0.45em]";

            // Layout Stability: inline-flex for text wrapper to align icon/text
            return wrapGrid(
                <div className={`flex flex-col ${bodyClass}`}>
                    <div className="flex items-start gap-3 ml-1">
                        <div className={`relative ${bulletSizeClass} shrink-0 opacity-80`}>
                            <Image
                                src="/assets/symbol.png"
                                alt="bullet"
                                fill
                                sizes="12px"
                                unoptimized
                                className="object-contain"
                            />
                        </div>
                        {/* Changed to inline-flex to stabilize inline images */}
                        <div className="flex-1 leading-relaxed inline-flex flex-wrap items-center gap-x-1">
                            <Text text={value.rich_text} />
                        </div>
                    </div>
                    {/* Recursively render children if present */}
                    {block.children && block.children.length > 0 && (
                        <div className="ml-6 mt-1 flex flex-col gap-1">
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
                </div>,
                'mb-8'
            );
        case 'numbered_list_item':
            return wrapGrid(<div className={`list-decimal ml-4 ${bodyClass}`} style={{ display: 'list-item' }}><Text text={value.rich_text} /></div>, 'mb-8');
        case 'quote':
            return wrapGrid(<blockquote className={`border-l-4 border-gray-300 pl-4 italic ${bodyClass}`}><Text text={value.rich_text} /></blockquote>, 'mb-8');
        case 'callout':
            return wrapGrid(
                <div className={`p-4 bg-gray-100 rounded flex gap-4 ${bodyClass}`}>
                    {value.icon?.emoji && <span>{value.icon.emoji}</span>}
                    <div><Text text={value.rich_text} /></div>
                </div>,
                'mb-8'
            );
        case 'column_list': {
            const childCount = block.children?.length || 0;

            // Pre-scan labels for color overrides to synchronize borders
            let syncColor = null;
            block.children?.forEach(col => {
                const labelBlock = col.children?.[0];
                if (labelBlock) {
                    const rt = labelBlock[labelBlock.type]?.rich_text;
                    if (rt?.[0]?.annotations?.color) {
                        const c = rt[0].annotations.color;
                        if (c.includes('red') || c.includes('orange')) syncColor = '#E86452';
                        else if (c.includes('blue')) syncColor = '#2A4458';
                    }
                }
            });

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
                                inheritedBorderColor={syncColor}
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
                        />
                    ))}
                </div>
            );
        default:
            return null;
    }
};

export default NotionRenderer;
