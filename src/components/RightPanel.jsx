'use client';

import React, { useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { getDailyVerses } from '../data/verses';
import ScriptureCard from './ScriptureCard';

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

    return (
        <div className="w-full h-full relative flex items-center justify-center bg-[#F4F3EF] overflow-hidden">
            <AnimatePresence mode="wait">
                <ScriptureCard
                    key={activeSection}
                    headlineEn={currentVerse.textEn}
                    bodyKo={currentVerse.textKo}
                    reference={currentVerse.ref}
                    animate={true}
                />
            </AnimatePresence>
        </div>
    );
};

export default RightPanel;
