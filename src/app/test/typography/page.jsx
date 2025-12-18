'use client';

import React from 'react';
import { CURRENT_TEXT, NEXT_TEXT } from '../../../lib/typography-tokens';

// Sample Texts
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

const TypographyTestPage = () => {
    const roles = Object.keys(CURRENT_TEXT);

    return (
        <div className="min-h-screen bg-[#F4F3EF] text-[#05121C] font-sans">
            {/* Header / Controls */}
            <div className="bg-[#05121C] text-white p-6 sticky top-0 z-50 flex justify-between items-center shadow-lg">
                <div>
                    <h1 className="text-xl font-bold uppercase tracking-wider">Typography Audit</h1>
                    <p className="text-sm opacity-70 font-mono">Comparing Production vs. Proposed Tokens</p>
                </div>
                <a href="/" className="text-sm underline hover:text-[#5F94BD]">Back Home</a>
            </div>

            {/* Split View */}
            <div className="flex flex-col md:flex-row min-h-screen">

                {/* LEFT: Current Production */}
                <div className="w-full md:w-1/2 border-r border-gray-300 p-8 md:p-12 overflow-y-auto bg-white">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-12 sticky top-0 bg-white py-4 border-b">
                        Current Production
                    </h2>

                    <div className="space-y-16">
                        {roles.map(role => (
                            <div key={role} className="group">
                                <div className="mb-2 flex justify-between items-baseline">
                                    <span className="text-xs font-mono px-2 py-1 bg-gray-100 rounded text-gray-500">{role}</span>
                                </div>

                                {/* Render Sample */}
                                <div className={CURRENT_TEXT[role]}>
                                    {SAMPLES[role] || "Sample Text"}
                                </div>

                                {/* Class String Debug */}
                                <code className="block mt-4 text-[10px] text-gray-400 font-mono break-all opacity-50 group-hover:opacity-100 transition-opacity">
                                    {CURRENT_TEXT[role]}
                                </code>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT: Proposed Tokens */}
                <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto bg-[#F9F9F9]">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-12 sticky top-0 bg-[#F9F9F9] py-4 border-b">
                        Proposed Next (Fluid)
                    </h2>

                    <div className="space-y-16">
                        {roles.map(role => (
                            <div key={role} className="group">
                                <div className="mb-2 flex justify-between items-baseline">
                                    <span className="text-xs font-mono px-2 py-1 bg-blue-50 text-blue-600 rounded">{role}</span>
                                </div>

                                {/* Render Sample */}
                                <div className={NEXT_TEXT[role]}>
                                    {SAMPLES[role] || "Sample Text"}
                                </div>

                                {/* Class String Debug */}
                                <code className="block mt-4 text-[10px] text-blue-300 font-mono break-all opacity-50 group-hover:opacity-100 transition-opacity">
                                    {NEXT_TEXT[role]}
                                </code>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TypographyTestPage;
