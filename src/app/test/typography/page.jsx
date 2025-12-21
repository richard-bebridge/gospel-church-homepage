'use client';

import React, { useState, useMemo } from 'react';
import { CURRENT_TEXT, NEXT_TEXT } from '../../../lib/typography-tokens';
import { saveTypographyConfig } from '../../actions/saveTypography';

const SAMPLES = {
    hero_en: "Seek. Stand. Transform.",
    nav_en: "About Messages Visit",
    badge: "THIS WEEK'S SERMON",
    page_title_ko: "소망의 하나님, 평안의 주님",
    section_title_ko_display: "01",
    section_heading_ko: "복음은 모든 믿는 자에게 구원을 주시는 하나님의 능력이라",
    body_ko_default: "하나님은 영이시니 예배하는 자가 영과 진리로 예배할지니라. 우리가 알거니와 하나님을 사랑하는 자 곧 그의 뜻대로 부르심을 입은 자들에게는 모든 것이 합력하여 선을 이루느니라.",
    body_ko_long: "그러므로 형제들아 내가 하나님의 모든 자비하심으로 너희를 권하노니 너희 몸을 하나님이 기뻐하시는 거룩한 산 제물로 드리라 이는 너희가 드릴 영적 예배니라.",
    verse_text: "태초에 하나님이 천지를 창조하시니라 (창세기 1:1)",
    footer_contact_label: "T.",
    footer_contact_value: "02-583-2014"
};

const FONTS = ['font-korean', 'font-english', 'font-mono'];
const WEIGHTS = ['font-thin', 'font-light', 'font-normal', 'font-medium', 'font-bold', 'font-black'];

// Theme Colors
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

    const getParsedToken = (role) => {
        const cls = tokens[role] || "";

        let min = 16, max = 16;
        let font = 'font-english';
        let weight = 'font-normal';
        let leading = 'leading-normal';
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

        // Color (Arbitrary HEX match)
        const colorMatch = cls.match(/text-\[#([0-9A-Fa-f]{6})\]/);
        if (colorMatch) {
            color = `#${colorMatch[1]}`;
        } else {
            // Check for standard tailwind text-colors if needed, but we mostly use hex in tokens
            // Default to #05121C if not found
        }

        return { min, max, font, weight, leading, color };
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
        const slopeVw = (slope * 100).toFixed(2); // Careful with negative slope if max < min

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
            .replace(/text-\[clamp.*?\]/, '')
            .replace(/text-\[\d+px\]/, '')
            .replace(/font-(sans|serif|mono|yisunshin|pretendard|korean)/, '')
            .replace(/font-(thin|light|normal|medium|bold|black)/, '')
            .replace(/leading-[\w-\[\]\.]+/, '')
            .replace(/text-\[#[0-9A-Fa-f]{6}\]/, '') // remove hex color
            .replace(/text-(gray|blue|red|white|black)-[\d]+/, '') // remove tailwind color
            .replace(/\s+/g, ' ').trim();

        const newCls = `${fontSizeCls} ${newSettings.font} ${newSettings.weight} ${newSettings.leading} ${colorCls} ${remainder}`.trim();

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

        return {
            fontSize,
            color: s.color,
            // Font/Weight/Leading handled by Tailwind classes which are usually static/pre-generated
            // If they are dynamic, we might need to map them to CSS too, but usually standard classes work fine.
        };
    };

    return (
        <div className="min-h-screen bg-[#111] flex flex-col md:flex-row font-english text-[#EAEAEA] overflow-hidden">

            {/* CONTROLS (Left Panel) */}
            <div className={`w-full md:w-80 bg-[#1E1E1E] border-r border-[#333] flex flex-col h-screen z-20 shadow-2xl transition-transform`}>
                <div className="p-5 border-b border-[#333] bg-[#05121C]">
                    <h1 className="text-sm font-bold uppercase tracking-widest text-[#E86452]">Type Lab v2.5</h1>
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
                        <input type="range" min="10" max="100" step="1"
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
                        <input type="range" min="10" max="120" step="1"
                            value={currentSettings.max}
                            onChange={e => {
                                const val = parseFloat(e.target.value);
                                updateToken('max', val);
                                if (val < currentSettings.min) updateToken('min', val);
                            }}
                            className="w-full accent-blue-500 h-1 bg-gray-600 rounded-lg appearance-none"
                        />
                    </div>

                    {/* Leading */}
                    <div>
                        <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">Line Height</label>
                        <select value={currentSettings.leading} onChange={e => updateToken('leading', e.target.value)}
                            className="w-full bg-[#2A2A2A] text-xs p-2 rounded border border-[#333] focus:border-blue-500 outline-none">
                            {['leading-none', 'leading-tight', 'leading-snug', 'leading-normal', 'leading-relaxed', 'leading-loose'].map(l => (
                                <option key={l} value={l}>{l}</option>
                            ))}
                        </select>
                    </div>

                </div>

                <div className="p-4 border-t border-[#333] bg-[#1E1E1E]">
                    <button onClick={handleSave} disabled={saving}
                        className={`w-full py-3 text-xs font-bold uppercase tracking-widest transition-all rounded shadow-lg
                        ${saving ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#E86452] hover:bg-red-500 hover:scale-[1.02] active:scale-95 text-white'}`}>
                        {saving ? 'Writing to Disk...' : 'Apply Config to System'}
                    </button>
                </div>
            </div>

            {/* MAIN PREVIEW AREA */}
            <div className={`flex-1 flex flex-col overflow-hidden transition-colors ${bgMode === 'light' ? 'bg-[#F4F3EF]' : 'bg-[#121212]'}`}>

                {/* Resizer Bar */}
                <div className="h-12 border-b border-gray-200/10 flex items-center justify-center px-4 bg-black/5 gap-4">
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

                {/* Canvas */}
                <div className="flex-1 overflow-y-auto p-8 flex justify-center">
                    <div
                        className={`transition-all duration-300 shadow-2xl border-x border-dashed border-gray-400/20 px-8 py-12 min-h-screen
                            ${bgMode === 'light' ? 'bg-white' : 'bg-[#1E1E1E]'}`}
                        style={{ width: `${viewportWidth}%` }}
                    >
                        <h2 className={`text-xs font-bold uppercase tracking-widest mb-12 border-b pb-4 ${bgMode === 'light' ? 'text-gray-300' : 'text-gray-600'}`}>
                            Live Preview Canvas
                        </h2>

                        <div className="space-y-16 pb-32">
                            {Object.keys(tokens).map((role) => {
                                const styles = getComputedStyle(role);
                                const isSelected = selectedRole === role;
                                const parsed = getParsedToken(role);

                                return (
                                    <div
                                        key={role}
                                        onClick={() => setSelectedRole(role)}
                                        className={`group cursor-pointer p-4 -mx-4 rounded-xl transition-all relative
                                            ${isSelected ? (bgMode === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50/50') : 'hover:bg-gray-500/5'}
                                        `}
                                    >
                                        <div className="mb-2 flex justify-between items-center opacity-50 group-hover:opacity-100 transition-opacity">
                                            <span className={`text-[10px] font-mono px-2 py-1 rounded uppercase tracking-wide
                                                ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-500 text-white'}
                                            `}>
                                                {role}
                                            </span>
                                            {isSelected && <span className="text-[10px] text-blue-500 font-bold">● Editing</span>}
                                        </div>

                                        {/* 
                                           Here we apply inline styles for fluid size and color to guarantee instant feedback 
                                           overriding fallback tailwind classes if they haven't recompiled yet.
                                           We KEEP the tailwind classes for font/weight/leading as they are usually static.
                                           (If font/weight classes don't load instantly, it's rare but possible, usually they exist in bundle)
                                        */}
                                        <div
                                            className={`${parsed.font} ${parsed.weight} ${parsed.leading}`}
                                            style={{
                                                fontSize: styles.fontSize,
                                                color: styles.color,
                                                lineHeight: parsed.leading === 'leading-none' ? 1
                                                    : parsed.leading === 'leading-tight' ? 1.25
                                                        : parsed.leading === 'leading-relaxed' ? 1.625
                                                            : parsed.leading === 'leading-loose' ? 2 : 1.5
                                            }}
                                        >
                                            {SAMPLES[role] || "Quick brown fox jumps over the lazy dog."}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default TypographyPlayground;
