'use client';

import React, { useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { getDailyVerses } from '../data/verses';
import ScriptureCard from './ScriptureCard';

import { HOME_LAYOUT_CONFIG } from '../lib/home-layout-config';

const RightPanel = ({ activeSection, sections = [] }) => {
    // Fallback Legacy Verses
    const legacyVerses = useMemo(() => getDailyVerses(), []);

    const getVerseData = () => {
        // 1. Try fetching from dynamic sections
        if (sections && sections.length > 0) {
            // Safety for index
            const index = activeSection % sections.length;
            const sec = sections[index];
            if (sec && sec.verse) {
                return {
                    textEn: sec.verse.textEn || sec.verse.text, // Fallback if En missing
                    textKo: sec.verse.text,
                    ref: sec.verse.normalizedReference || "Reference"
                };
            }
        }

        // 2. Fallback to legacy
        const legacy = legacyVerses[activeSection % legacyVerses.length];
        return {
            textEn: legacy.text,
            textKo: legacy.textKo,
            ref: legacy.ref
        };
    };

    const currentVerse = getVerseData();

    // Align verses with Left Panel body text using Layout Lab config
    const paddingTop = HOME_LAYOUT_CONFIG.sections[activeSection] || HOME_LAYOUT_CONFIG.default;

    return (
        <div className="w-full h-full relative flex items-start justify-center bg-[#F4F3EF] overflow-hidden">
            <AnimatePresence mode="wait">
                <ScriptureCard
                    key={activeSection}
                    headlineEn={currentVerse.textEn}
                    bodyKo={currentVerse.textKo}
                    reference={currentVerse.ref}
                    animate={true}
                    className={`w-full flex justify-center ${paddingTop}`}
                />
            </AnimatePresence>
        </div>
    );
};

export default RightPanel;
