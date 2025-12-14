import { useState, useEffect, useRef } from 'react';

export const useDynamicHeight = (currentSection, sections, fontScale) => {
    const [contentHeight, setContentHeight] = useState('auto');
    const sectionRefs = useRef([]);

    useEffect(() => {
        const currentElement = sectionRefs.current[currentSection];
        if (!currentElement) return;

        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const height = entry.borderBoxSize?.[0]?.blockSize || entry.target.getBoundingClientRect().height;
                setContentHeight(height);
            }
        });

        observer.observe(currentElement);
        return () => observer.disconnect();
    }, [currentSection, sections, fontScale]);

    return { contentHeight, sectionRefs };
};

export const useVerseAlignment = (activeSection, sectionsRef, fontScale) => {
    const [verseAlignmentOffset, setVerseAlignmentOffset] = useState(0);

    useEffect(() => {
        const calculateOffset = () => {
            const currentSectionEl = sectionsRef.current[activeSection];
            if (!currentSectionEl) return;

            // User Request: Align verses with Section Heading (Title)
            // Section Heading has 'pt-2' (8px) top padding.
            // Right Panel has same base padding (pt-96) as Section.
            // So we add 8px to align baselines/tops.
            const titleEl = currentSectionEl.querySelector('h2');
            if (titleEl) {
                setVerseAlignmentOffset(8);
            } else {
                setVerseAlignmentOffset(0);
            }
        };

        calculateOffset();
        window.addEventListener('resize', calculateOffset);
        return () => window.removeEventListener('resize', calculateOffset);
    }, [activeSection, sectionsRef, fontScale]);

    return verseAlignmentOffset;
};
