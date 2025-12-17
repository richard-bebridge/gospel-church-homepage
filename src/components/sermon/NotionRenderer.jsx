import React from 'react';
import Image from 'next/image';

const LinkIcon = () => (
    <span
        className="inline-flex items-center justify-center ml-1 text-[#2A4458] align-middle"
        style={{ transform: 'translateY(-2px)' }}
        aria-label="External link icon"
    >
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
        >
            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </span>
);

const ExternalLinkIconButton = ({ href }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center justify-center ml-1 text-[#2A4458] align-middle"
        style={{ transform: 'translateY(-2px)' }}
        aria-label="Open link"
    >
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
        >
            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </a>
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
                        <div key={idx} className="shrink-0">
                            {item.link ? (
                                <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block"
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

// Sub-component for rendering enriched text
const Text = ({ text }) => {
    if (!text) return null;
    return text.map((value, i) => {
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

                return (
                    <InlineAssetToken
                        key={i}
                        filename={filename}
                        sizeParam={sizeParam}
                        scaleParam={scaleParam}
                    />
                );
            }
        }

        return (
            <span
                key={i}
                className={[
                    (bold || text.link) ? "font-bold" : "",
                    code ? "bg-gray-100 p-1 rounded font-mono text-sm" : "",
                    italic ? "italic" : "",
                    strikethrough ? "line-through" : "",
                    underline ? "underline" : "",
                ].join(" ")}
                style={color !== "default" ? { color } : {}}
            >
                {text.content}
                {text.link && <ExternalLinkIconButton href={text.link.url} />}
            </span>
        );
    });
};

const NotionRenderer = ({ block, level = 0 }) => {
    const { type } = block;
    const value = block[type];
    if (!value?.rich_text && type !== 'image') return null;

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

                return <GalleryBlock items={items} size={size ? parseInt(size) : 24} gap={gap ? parseInt(gap) : 12} />;
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

                return <GalleryBlock items={items} size={size} gap={gap} />;
            }
        }
    }

    switch (type) {
        case 'paragraph':
            return <p><Text text={value.rich_text} /></p>;
        case 'heading_1':
            return <h1 className="text-3xl font-bold mt-4 mb-2"><Text text={value.rich_text} /></h1>;
        case 'heading_2':
            return <h2 className="text-2xl font-bold mt-3 mb-2"><Text text={value.rich_text} /></h2>;
        case 'heading_3':
            return <h3 className="text-xl font-bold mt-2 mb-1"><Text text={value.rich_text} /></h3>;
        case 'bulleted_list_item':
            // Logic for sub-bullet size (Half size if level > 0)
            const isSubBullet = level > 0;
            const bulletSizeClass = isSubBullet ? "w-1.5 h-1.5 mt-[0.6em]" : "w-3 h-3 mt-[0.45em]";

            // Layout Stability: inline-flex for text wrapper to align icon/text
            return (
                <div className="flex flex-col">
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
                                <NotionRenderer key={child.id} block={child} level={level + 1} />
                            ))}
                        </div>
                    )}
                </div>
            );
        case 'numbered_list_item':
            return <div className="list-decimal ml-4" style={{ display: 'list-item' }}><Text text={value.rich_text} /></div>;
        case 'quote':
            return <blockquote className="border-l-4 border-gray-300 pl-4 italic"><Text text={value.rich_text} /></blockquote>;
        case 'callout':
            return (
                <div className="p-4 bg-gray-100 rounded flex gap-4">
                    {value.icon?.emoji && <span>{value.icon.emoji}</span>}
                    <div><Text text={value.rich_text} /></div>
                </div>
            );
        default:
            return null;
    }
};

export default NotionRenderer;
