import React from 'react';
import Image from 'next/image';
import symbolImg from '../../assets/symbol.png';

// Sub-component for rendering enriched text
const Text = ({ text }) => {
    if (!text) return null;
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

const NotionRenderer = ({ block }) => {
    const { type } = block;
    const value = block[type];
    if (!value?.rich_text) return null;

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
            return (
                <div className="flex items-start gap-3 ml-1">
                    <div className="relative w-3 h-3 mt-[0.45em] shrink-0 opacity-80">
                        <Image
                            src={symbolImg}
                            alt="bullet"
                            fill
                            sizes="12px"
                            className="object-contain"
                        />
                    </div>
                    <div className="flex-1 leading-relaxed">
                        <Text text={value.rich_text} />
                    </div>
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
