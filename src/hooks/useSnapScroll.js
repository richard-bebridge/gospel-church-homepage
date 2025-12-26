'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * useSnapScrollState
 * Simplified hook using IntersectionObserver to track active index
 * compatible with native CSS scroll-snap.
 */
export const useSnapScrollState = (sections, { containerRef, sectionRefs, footerRef, onSnap }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const isFooter = activeIndex === sections.length;

    // ----------------------------------------------------------------
    // Intersection Observer for Active Index
    // ----------------------------------------------------------------
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const options = {
            root: container,
            threshold: 0.5, // Section considered "active" when 50% visible
        };

        const callback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Find which section this is
                    // Check sections
                    const idx = sectionRefs.current.findIndex(ref => ref === entry.target);
                    if (idx !== -1) {
                        setActiveIndex(idx);
                        if (onSnap) onSnap(idx);
                    }
                    // Check footer
                    if (footerRef?.current && entry.target === footerRef.current) {
                        setActiveIndex(sections.length);
                        if (onSnap) onSnap(sections.length);
                    }
                }
            });
        };

        const observer = new IntersectionObserver(callback, options);

        sectionRefs.current.forEach((el) => {
            if (el) observer.observe(el);
        });
        if (footerRef?.current) {
            observer.observe(footerRef.current);
        }

        return () => observer.disconnect();
    }, [sections, containerRef, sectionRefs, footerRef, onSnap]);


    // ----------------------------------------------------------------
    // Programmatic Snap (Click / Hash)
    // ----------------------------------------------------------------
    const performSnap = (targetIndex) => {
        if (!containerRef.current) return;

        // Clamp
        if (targetIndex < 0 || targetIndex > sections.length) return;

        let targetEl = null;
        if (targetIndex < sections.length) {
            targetEl = sectionRefs.current[targetIndex];
        } else if (footerRef?.current) {
            targetEl = footerRef.current;
        }

        if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return {
        activeIndex,
        setActiveIndex,
        isFooter,
        performSnap
    };
};
