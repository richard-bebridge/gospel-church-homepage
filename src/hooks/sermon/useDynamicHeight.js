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

            const titleEl = currentSectionEl.querySelector('h2');
            if (titleEl) {
                setVerseAlignmentOffset(titleEl.offsetHeight + 32);
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
