import React, { useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { getDailyVerses } from '../../data/verses';
import ScriptureCard from '../ScriptureCard';

const Effect2 = ({ activeSection }) => {
    const verses = useMemo(() => getDailyVerses(), []);

    // Select a verse based on the active section (modulo to loop if sections > verses)
    const currentVerse = verses[activeSection % verses.length];

    return (
        <div className="w-full h-full relative flex items-center justify-center bg-[#F4F3EF] overflow-hidden">
            <AnimatePresence mode="wait">
                <ScriptureCard
                    key={activeSection}
                    headlineEn={currentVerse.text}
                    bodyKo={currentVerse.textKo}
                    reference={currentVerse.ref}
                    animate={true}
                />
            </AnimatePresence>
        </div>
    );
};

export default Effect2;
