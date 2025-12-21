'use client';

import React, { useState, useMemo, useEffect } from 'react';
// ... (imports remain same)
import { CURRENT_TEXT, NEXT_TEXT } from '../../lib/typography-tokens';
import { saveTypographyConfig } from '../actions/saveTypography';

const SAMPLES = {
    hero_en: "Seek. Stand. Transform. Radiate.",
    nav_en: "About Messages Visit",
    badge: "THIS WEEK'S SERMON",
    badge_pill: "THIS WEEK",
    page_title_ko: "소망의 하나님, 평안의 주님",
    section_title_ko_display: "01",
    section_heading_ko: "복음은 모든 믿는 자에게 구원을 주시는 하나님의 능력이라",
    body_ko_default: "하나님은 영이시니 예배하는 자가 영과 진리로 예배할지니라. 우리가 알거니와 하나님을 사랑하는 자 곧 그의 뜻대로 부르심을 입은 자들에게는 모든 것이 합력하여 선을 이루느니라.",
    body_ko_long: "그러므로 형제들아 내가 하나님의 모든 자비하심으로 너희를 권하노니 너희 몸을 하나님이 기뻐하시는 거룩한 산 제물로 드리라 이는 너희가 드릴 영적 예배니라.",
    verse_text: "태초에 하나님이 천지를 창조하시니라 (창세기 1:1)",
    footer_contact_label: "T.",
    footer_contact_value: "02-583-2014",
    summary_title: "소망의 하나님, 평안의 주님 (Summary Title Example)",
    // New Roles
    notion_h1: "Notion H1 Title",
    notion_h3: "Notion H3 Heading",
    bullet_list: "This is a bullet list item",
    numbered_list: "1. This is a numbered list item",
    quote: "This is a blockquote.",
    callout: "This is a callout box.",
    caption: "Image Caption",
    reference_text: "* This is a reference text example",
    table_head: "Table Heading (Col 1)",
    table_cell: "Table Cell Content",
    link_text: "Click here to visit our website",
    verse_text: "태초에 하나님이 천지를 창조하시니라",
    verse_reference: "창세기 1:1"
};

const ROLE_TAGS = {
    hero_en: "Hero",
    nav_en: "Nav",
    badge: "Badge",
    badge_pill: "Pill",
    page_title_ko: "H1",
    section_title_ko_display: "Display",
    section_heading_ko: "H2",
    body_ko_default: "Body",
    body_ko_long: "Body (L)",
    verse_text: "Verse",
    footer_contact_label: "Label",
    footer_contact_value: "Value",
    summary_title: "Sum.H2",
    notion_h1: "H1",
    notion_h3: "H3",
    bullet_list: "Bullet",
    numbered_list: "Number",
    quote: "Quote",
    callout: "Callout",
    caption: "Caption",
    reference_text: "Ref",
    table_head: "Th",
    table_cell: "Td",
    link_text: "Link",
    verse_reference: "V.Ref"
};

const FONTS = ['font-korean', 'font-english', 'font-mono'];
const WEIGHTS = ['font-thin', 'font-light', 'font-normal', 'font-medium', 'font-bold', 'font-black'];
const TRACKING = ['tracking-tighter', 'tracking-tight', 'tracking-normal', 'tracking-wide', 'tracking-wider', 'tracking-widest'];
const MARGINS = ['mb-0', 'mb-1', 'mb-2', 'mb-3', 'mb-4', 'mb-5', 'mb-6', 'mb-8', 'mb-10', 'mb-12', 'mb-16', 'mb-20', 'mb-24', 'mb-32'];
const ALIGNMENTS = ['text-left', 'text-center', 'text-right', 'text-justify'];

const GROUPS = {
    "Highlights": ["hero_en", "page_title_ko", "section_title_ko_display", "section_heading_ko", "summary_title"],
    "Body & Content": ["notion_h1", "notion_h3", "body_ko_default", "body_ko_long", "bullet_list", "numbered_list", "quote", "callout", "table_head", "table_cell", "link_text", "verse_text", "verse_reference", "reference_text"],
    "UI Components": ["nav_en", "badge", "badge_pill", "caption", "footer_contact_label", "footer_contact_value"]
};
const COLORS = [
    { name: 'Dark', value: '#05121C' },
    { name: 'Gray 700', value: '#374151' },
    { name: 'Gray 500', value: '#6B7280' },
    { name: 'Blue', value: '#5F94BD' },
    { name: 'Accent', value: '#E86452' },
    { name: 'White', value: '#FFFFFF' }, // useful for dark bg check
];

const TypographyPlayground = () => {
    const [tokens, setTokens] = useState(NEXT_TEXT);
    const [selectedRole, setSelectedRole] = useState('body_ko_default');
    const [saving, setSaving] = useState(false);

    // Viewport Simulator State
    const [viewportWidth, setViewportWidth] = useState(100); // % width
    const [bgMode, setBgMode] = useState('light'); // light or dark

    // Force sync new keys from NEXT_TEXT if missing in state (Hot Fix for HMR/New Tokens)
    useEffect(() => {
        setTokens(prev => {
            const nextKeys = Object.keys(NEXT_TEXT);
            const prevKeys = Object.keys(prev);
            const missing = nextKeys.filter(k => !prevKeys.includes(k));
            if (missing.length > 0) {
                const update = { ...prev };
                missing.forEach(k => update[k] = NEXT_TEXT[k]);
                return update;
            }
            return prev;
        });
    }, []);

    const getParsedToken = (role) => {
        const cls = tokens[role] || "";

        let min = 16, max = 16;
        let font = 'font-english';
        let weight = 'font-normal';
        let leading = 'leading-normal';
        let tracking = 'tracking-normal';
        let color = '#05121C';

        // Extract Fluid Clamp
        const clampMatch = cls.match(/text-\[clamp\(([\d.]+)px,.*?,([\d.]+)px\)\]/);
        if (clampMatch) {
            min = parseFloat(clampMatch[1]);
            max = parseFloat(clampMatch[2]);
        } else {
            const staticMatch = cls.match(/text-\[([\d.]+)px\]/);
            if (staticMatch) {
                min = parseFloat(staticMatch[1]);
                max = parseFloat(staticMatch[1]);
            }
        }

        // Font
        const fontMatch = cls.match(/(font-(?:sans|serif|mono|yisunshin|pretendard|korean))/);
        if (fontMatch) font = fontMatch[1];

        // Weight
        const weightMatch = cls.match(/(font-(?:thin|light|normal|medium|bold|black))/);
        if (weightMatch) weight = weightMatch[1];

        // Leading
        const leadingMatch = cls.match(/(leading-[\w-\[\]\.]+)/);
        if (leadingMatch) leading = leadingMatch[1];

        // Tracking (Letter Spacing)
        const trackingMatch = cls.match(/(tracking-(?:tighter|tight|normal|wide|wider|widest|\[.*?\]))/);
        if (trackingMatch) tracking = trackingMatch[1];

        // Margin Bottom
        let marginBottom = 'mb-0';
        const mbMatch = cls.match(/(mb-[\d]+)/);
        if (mbMatch) marginBottom = mbMatch[1];

        // Margin Top
        let marginTop = 'mt-0';
        const mtMatch = cls.match(/(mt-[\d]+)/);
        if (mtMatch) marginTop = mtMatch[1];

        // Alignment
        let textAlign = 'text-left';
        const alignMatch = cls.match(/(text-(?:left|center|right|justify))/);
        if (alignMatch) textAlign = alignMatch[1];

        // Color (Arbitrary HEX match)
        const colorMatch = cls.match(/text-\[#([0-9A-Fa-f]{6})\]/);
        if (colorMatch) {
            color = `#${colorMatch[1]}`;
        }

        return { min, max, font, weight, leading, tracking, marginBottom, marginTop, textAlign, color };
    };

    const currentSettings = getParsedToken(selectedRole);

    const updateToken = (key, value) => {
        const prev = getParsedToken(selectedRole);
        const newSettings = { ...prev, [key]: value };

        // Reconstruct & Update State
        // 1. Size
        let fontSizeCls = "";
        const minWidth = 320;
        const maxWidth = 1200;
        const slope = (newSettings.max - newSettings.min) / (maxWidth - minWidth);
        const yIntercept = newSettings.min - (slope * minWidth);
        const slopeVw = (slope * 100).toFixed(2);

        if (newSettings.min === newSettings.max) {
            fontSizeCls = `text-[${newSettings.min}px]`;
        } else {
            fontSizeCls = `text-[clamp(${newSettings.min}px,${slopeVw}vw+${yIntercept.toFixed(2)}px,${newSettings.max}px)]`;
        }

        // 2. Color
        const colorCls = `text-[${newSettings.color}]`;

        // 3. Assemble
        const oldCls = tokens[selectedRole] || "";
        // Strip properties we manage
        let remainder = oldCls
            .replace(/text-\[clamp.*?\]/g, '')
            .replace(/text-\[\d+px\]/g, '')
            .replace(/text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)/g, '') // remove standard sizes
            .replace(/md:text-[\w-\[\]]+/g, '') // remove desktop overrides
            .replace(/font-(sans|serif|mono|yisunshin|pretendard|korean)/g, '')
            .replace(/font-(thin|light|normal|medium|bold|black)/g, '')
            .replace(/leading-[\w-\[\]\.]+/g, '')
            .replace(/tracking-[\w-\[\]\.]+/g, '')
            .replace(/mb-[\d]+/g, '')
            .replace(/mt-[\d]+/g, '')
            .replace(/text-(left|center|right|justify)/g, '') // remove alignment
            .replace(/text-\[#[0-9A-Fa-f]{6}\]/g, '') // remove hex color
            .replace(/text-(gray|blue|red|white|black)-[\d]+/g, '') // remove tailwind color
            .replace(/\s+/g, ' ').trim();

        const newCls = `${fontSizeCls} ${newSettings.font} ${newSettings.weight} ${newSettings.leading} ${newSettings.tracking} ${newSettings.marginTop} ${newSettings.marginBottom} ${newSettings.textAlign} ${colorCls} ${remainder}`.trim();

        setTokens(prev => ({ ...prev, [selectedRole]: newCls }));
    };

    const handleSave = async () => {
        setSaving(true);
        const result = await saveTypographyConfig(tokens);
        setSaving(false);
        if (result.success) alert("✅ Saved!");
        else alert("❌ Save Failed: " + result.message);
    };

    // Calculate Inline Styles for Instant Preview (Bypassing Tailwind JIT latency)
    const getComputedStyle = (role) => {
        const s = getParsedToken(role);

        // Re-calc fluid clamp for inline style
        const minWidth = 320;
        const maxWidth = 1200;
        const slope = (s.max - s.min) / (maxWidth - minWidth);
        const yIntercept = s.min - (slope * minWidth);
        const slopeVw = (slope * 100).toFixed(2);

        const fontSize = s.min === s.max
            ? `${s.min}px`
            : `clamp(${s.min}px, ${slopeVw}vw + ${yIntercept.toFixed(2)}px, ${s.max}px)`;

        // Map tracking classes to approximate em/px values if needed for instant feedback
        // Tailwind defaults: tighter: -0.05em, tight: -0.025em, normal: 0, wide: 0.025em, wider: 0.05em, widest: 0.1em
        let letterSpacing = 'normal';
        switch (s.tracking) {
            case 'tracking-tighter': letterSpacing = '-0.05em'; break;
            case 'tracking-tight': letterSpacing = '-0.025em'; break;
            case 'tracking-normal': letterSpacing = '0em'; break;
            case 'tracking-wide': letterSpacing = '0.025em'; break;
            case 'tracking-wider': letterSpacing = '0.05em'; break;
            case 'tracking-widest': letterSpacing = '0.1em'; break;
            default: letterSpacing = 'normal';
        }

        // Map Mb to px (approximate for inline preview if needed, though we rely on classes mostly)
        // 1 = 4px
        const mbVal = parseInt((s.marginBottom || 'mb-0').replace('mb-', '')) || 0;
        const marginBottom = `${mbVal * 4}px`;

        return {
            fontSize,
            color: s.color,
            letterSpacing,
            textAlign: s.textAlign ? s.textAlign.replace('text-', '') : 'left',
            marginBottom // Pass this through to style if needed, or rely on class
        };
    };

    return (
        <div className="min-h-screen bg-[#111] flex flex-row font-english text-[#EAEAEA] overflow-x-hidden">

            {/* CONTROLS (Left Panel) - Fixed */}
            <div className={`w-80 bg-[#1E1E1E] border-r border-[#333] flex flex-col h-screen fixed top-0 left-0 z-20 shadow-2xl shrink-0`}>
                <div className="p-5 border-b border-[#333] bg-[#05121C] shrink-0">
                    <h1 className="text-sm font-bold uppercase tracking-widest text-[#E86452]">Type Lab v2.7</h1>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-[10px] text-gray-500 uppercase">{selectedRole}</span>
                        <div className="flex gap-2">
                            <button onClick={() => setBgMode(b => b === 'light' ? 'dark' : 'light')} className="text-xs p-1 bg-[#333] rounded">
                                {bgMode === 'light' ? '☀️' : 'aaa'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6 flex-1 overflow-y-auto space-y-8 scrollbar-thin scrollbar-thumb-gray-600">
                    {/* ... Controls content ... */}

                    {/* Font & Weight */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">Family</label>
                            <select value={currentSettings.font} onChange={e => updateToken('font', e.target.value)}
                                className="w-full bg-[#2A2A2A] text-xs p-2 rounded border border-[#333] focus:border-blue-500 outline-none">
                                {FONTS.map(f => <option key={f} value={f}>{f.replace('font-', '')}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">Weight</label>
                            <select value={currentSettings.weight} onChange={e => updateToken('weight', e.target.value)}
                                className="w-full bg-[#2A2A2A] text-xs p-2 rounded border border-[#333] focus:border-blue-500 outline-none">
                                {WEIGHTS.map(w => <option key={w} value={w}>{w.replace('font-', '')}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Color */}
                    <div>
                        <label className="text-[10px] font-bold uppercase text-gray-500 mb-2 block">Color</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {COLORS.map(c => (
                                <button key={c.name}
                                    onClick={() => updateToken('color', c.value)}
                                    className={`w-6 h-6 rounded-full border border-gray-600 ${currentSettings.color === c.value ? 'ring-2 ring-blue-500' : ''}`}
                                    style={{ backgroundColor: c.value }}
                                    title={c.name}
                                />
                            ))}
                        </div>
                        <input type="color" value={currentSettings.color} onChange={e => updateToken('color', e.target.value)}
                            className="w-full h-8 bg-transparent cursor-pointer" />
                    </div>

                    {/* Fluid Size */}
                    <div className="space-y-4 pt-4 border-t border-[#333]">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold uppercase text-gray-500">Min Size (Mobile)</label>
                            <span className="text-[10px] font-mono text-blue-400">{currentSettings.min}px / {(currentSettings.min / 16).toFixed(2)}rem</span>
                        </div>
                        <input type="range" min="6" max="100" step="1"
                            value={currentSettings.min}
                            onChange={e => {
                                const val = parseFloat(e.target.value);
                                updateToken('min', val);
                                if (val > currentSettings.max) updateToken('max', val);
                            }}
                            className="w-full accent-blue-500 h-1 bg-gray-600 rounded-lg appearance-none"
                        />

                        <div className="flex justify-between items-center mt-4">
                            <label className="text-[10px] font-bold uppercase text-gray-500">Max Size (Desktop)</label>
                            <span className="text-[10px] font-mono text-blue-400">{currentSettings.max}px / {(currentSettings.max / 16).toFixed(2)}rem</span>
                        </div>
                        <input type="range" min="6" max="120" step="1"
                            value={currentSettings.max}
                            onChange={e => {
                                const val = parseFloat(e.target.value);
                                updateToken('max', val);
                                if (val < currentSettings.min) updateToken('min', val);
                            }}
                            className="w-full accent-blue-500 h-1 bg-gray-600 rounded-lg appearance-none"
                        />
                    </div>

                    {/* Leading & Tracking */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#333]">
                        <div>
                            <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">Line Height</label>
                            <select value={currentSettings.leading} onChange={e => updateToken('leading', e.target.value)}
                                className="w-full bg-[#2A2A2A] text-xs p-2 rounded border border-[#333] focus:border-blue-500 outline-none">
                                {['leading-none', 'leading-tight', 'leading-snug', 'leading-normal', 'leading-relaxed', 'leading-loose'].map(l => (
                                    <option key={l} value={l}>{l.replace('leading-', '')}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">Tracking</label>
                            <select value={currentSettings.tracking} onChange={e => updateToken('tracking', e.target.value)}
                                className="w-full bg-[#2A2A2A] text-xs p-2 rounded border border-[#333] focus:border-blue-500 outline-none">
                                {TRACKING.map(t => (
                                    <option key={t} value={t}>{t.replace('tracking-', '')}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-[#333]">
                        <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">Text Alignment</label>
                        <select value={currentSettings.textAlign} onChange={e => updateToken('textAlign', e.target.value)}
                            className="w-full bg-[#2A2A2A] text-xs p-2 rounded border border-[#333] focus:border-blue-500 outline-none">
                            {ALIGNMENTS.map(a => (
                                <option key={a} value={a}>{a.replace('text-', '')}</option>
                            ))}
                        </select>
                    </div>

                    <div className="pt-4 border-t border-[#333]">
                        <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">Spacing (Margin)</label>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[9px] text-gray-500 block mb-1">Top</label>
                                <select value={currentSettings.marginTop} onChange={e => updateToken('marginTop', e.target.value)}
                                    className="w-full bg-[#2A2A2A] text-xs p-2 rounded border border-[#333] focus:border-blue-500 outline-none">
                                    <option value="mt-0">0px</option>
                                    {MARGINS.map(m => (
                                        <option key={`mt-${m}`} value={m.replace('mb', 'mt')}>{m.replace('mb-', '') * 4}px ({m.replace('mb', 'mt')})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-[9px] text-gray-500 block mb-1">Bottom</label>
                                <select value={currentSettings.marginBottom} onChange={e => updateToken('marginBottom', e.target.value)}
                                    className="w-full bg-[#2A2A2A] text-xs p-2 rounded border border-[#333] focus:border-blue-500 outline-none">
                                    {MARGINS.map(m => (
                                        <option key={m} value={m}>{m.replace('mb-', '') * 4}px ({m})</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-[#333] bg-[#1E1E1E] shrink-0">
                    <button onClick={handleSave} disabled={saving}
                        className={`w-full py-3 text-xs font-bold uppercase tracking-widest transition-all rounded shadow-lg
                        ${saving ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#E86452] hover:bg-red-500 hover:scale-[1.02] active:scale-95 text-white'}`}>
                        {saving ? 'Writing to Disk...' : 'Apply Config to System'}
                    </button>
                </div>
            </div>

            {/* MAIN PREVIEW AREA - Natural Scroll with Margin for Fixed Sidebar */}
            <div className={`flex-1 ml-80 flex flex-col min-h-screen transition-colors duration-300 ${bgMode === 'light' ? 'bg-[#F4F3EF]' : 'bg-[#121212]'}`}>

                {/* Resizer Bar (Sticky relative to Preview Area) */}
                <div className="h-12 border-b border-gray-200/10 flex items-center justify-center px-4 bg-black/5 gap-4 sticky top-0 z-10 backdrop-blur-sm">
                    <span className="text-[10px] uppercase font-bold text-gray-400">Viewport Width</span>
                    <input
                        type="range" min="30" max="100" step="1"
                        value={viewportWidth} onChange={e => setViewportWidth(e.target.value)}
                        className="w-64 accent-gray-500"
                    />
                    <div className="flex gap-2">
                        <button onClick={() => setViewportWidth(30)} className="text-[10px] px-2 py-1 bg-gray-200 text-black rounded hover:bg-white">Mobile</button>
                        <button onClick={() => setViewportWidth(100)} className="text-[10px] px-2 py-1 bg-gray-200 text-black rounded hover:bg-white">Desktop</button>
                    </div>
                </div>

                {/* Canvas Container */}
                <div className="flex-1 p-8 flex justify-center items-start">
                    <div
                        className={`transition-all duration-300 shadow-2xl border-x border-dashed border-gray-400/20 px-8 py-12 min-h-[80vh]
                            ${bgMode === 'light' ? 'bg-white' : 'bg-[#1E1E1E]'}`}
                        style={{ width: `${viewportWidth}%` }}
                    >
                        <h2 className={`text-xs font-bold uppercase tracking-widest mb-12 border-b pb-4 ${bgMode === 'light' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Live Preview Canvas
                        </h2>

                        <div className="space-y-16 pb-32">
                            {Object.entries(GROUPS).map(([groupName, keys]) => (
                                <div key={groupName} className="space-y-8">
                                    <h3 className="text-sm font-bold uppercase text-gray-400 border-b border-gray-200/20 pb-2">{groupName}</h3>
                                    <div className="space-y-8">
                                        {keys.map((role) => {
                                            if (!tokens[role]) return null;
                                            const styles = getComputedStyle(role);
                                            const isSelected = selectedRole === role;
                                            const parsed = getParsedToken(role);
                                            const tag = ROLE_TAGS[role] || "Code";

                                            return (
                                                <div
                                                    key={role}
                                                    onClick={() => setSelectedRole(role)}
                                                    className={`group cursor-pointer p-4 -mx-4 rounded-xl transition-all relative
                                                        ${isSelected ? (bgMode === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50/50') : 'hover:bg-gray-500/5'}
                                                    `}
                                                >
                                                    <div className="mb-2 flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                        {/* Role Tag */}
                                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wide
                                                            ${tag === 'H1' ? 'bg-red-500 text-white' :
                                                                tag === 'H2' ? 'bg-orange-500 text-white' :
                                                                    tag === 'H3' ? 'bg-amber-500 text-white' :
                                                                        tag === 'Display' ? 'bg-purple-600 text-white' :
                                                                            tag === 'Body' || tag === 'Body (L)' ? 'bg-green-600 text-white' :
                                                                                tag === 'Hero' ? 'bg-blue-600 text-white' :
                                                                                    tag === 'Nav' ? 'bg-cyan-600 text-white' :
                                                                                        tag === 'Badge' ? 'bg-pink-500 text-white' :
                                                                                            tag === 'Pill' ? 'bg-pink-600 text-white' :
                                                                                                tag === 'Quote' ? 'bg-teal-600 text-white' :
                                                                                                    tag === 'Callout' ? 'bg-indigo-500 text-white' :
                                                                                                        tag === 'Verse' ? 'bg-emerald-600 text-white' :
                                                                                                            tag === 'V.Ref' ? 'bg-emerald-700 text-white' :
                                                                                                                tag === 'Caption' ? 'bg-gray-500 text-white' :
                                                                                                                    tag === 'Ref' ? 'bg-slate-500 text-white' :
                                                                                                                        tag === 'Label' || tag === 'Value' ? 'bg-slate-600 text-white' :
                                                                                                                            'bg-gray-400 text-white'}
                                                        `}>
                                                            {tag}
                                                        </span>

                                                        <span className="text-[10px] font-mono text-gray-500">
                                                            {role}
                                                        </span>

                                                        {isSelected && <span className="text-[10px] text-blue-500 font-bold ml-auto">● Editing</span>}
                                                    </div>

                                                    <div
                                                        className={`${parsed.font} ${parsed.weight} ${parsed.leading} ${parsed.tracking} ${parsed.marginBottom}`}
                                                        style={{
                                                            fontSize: styles.fontSize,
                                                            color: styles.color,
                                                            lineHeight: parsed.leading === 'leading-none' ? 1
                                                                : parsed.leading === 'leading-tight' ? 1.25
                                                                    : parsed.leading === 'leading-relaxed' ? 1.625
                                                                        : parsed.leading === 'leading-loose' ? 2 : 1.5,
                                                            letterSpacing: styles.letterSpacing,
                                                            marginBottom: styles.marginBottom,
                                                            display: tokens[role]?.includes('list-') ? 'list-item' : 'block',
                                                            listStylePosition: 'inside'
                                                        }}
                                                    >
                                                        {SAMPLES[role] || "Quick brown fox jumps over the lazy dog."}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div >
    );
};

export default TypographyPlayground;
