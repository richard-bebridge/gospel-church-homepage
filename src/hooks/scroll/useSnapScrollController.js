'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { SCROLL_TRIGGER_MARGIN } from '../../components/sermon/constants';

/**
 * useSnapScrollController
 * 
 * Unified hook for layout scroll management.
 * - Tracks active section via IntersectionObserver
 * - Manages scroll container ref
 * - Provides programmatic scroll methods
 */
export const useSnapScrollController = (options = {}) => {
    const {
        rootMargin = SCROLL_TRIGGER_MARGIN,
        threshold = 0.1,
        initialSection = 0,
        onChange, // Optional callback when section changes
        dependencies = []
    } = options;

    const scrollRef = useRef(null);
    const sectionRefs = useRef(new Map());
    const [activeSection, setActiveSection] = useState(initialSection);
    const [direction, setDirection] = useState(1);

    // Register a section ref
    // Usage: ref={el => registerSection(key, el)}
    const registerSection = useCallback((key, element) => {
        if (element) {
            sectionRefs.current.set(key, element);
        } else {
            sectionRefs.current.delete(key);
        }
    }, []);

    // Scroll to a specific section
    const scrollToSection = useCallback((key, behavior = 'smooth', offset = 0) => {
        const container = scrollRef.current;
        const target = sectionRefs.current.get(key);

        if (container && target) {
            const top = target.offsetTop + offset;
            container.scrollTo({
                top,
                behavior
            });
        }
    }, []);

    // Setup Observer
    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const handleIntersect = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Find key for this element
                    let foundKey = null;
                    for (const [key, el] of sectionRefs.current.entries()) {
                        if (el === entry.target) {
                            foundKey = key;
                            break;
                        }
                    }

                    if (foundKey !== null) {
                        setActiveSection(prev => {
                            if (prev === foundKey) return prev;

                            // Determine direction (if keys are numeric, simple diff; else rely on DOM order?)
                            // For simplicity, we assume numeric keys for direction logic usually, 
                            // or just default to 1 if strings.
                            // If Sermon uses integer indices, this works.
                            let newDir = 1;
                            if (typeof prev === 'number' && typeof foundKey === 'number') {
                                newDir = foundKey > prev ? 1 : -1;
                            }
                            setDirection(newDir);

                            if (onChange) onChange(foundKey);
                            return foundKey;
                        });
                    }
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersect, {
            root: container,
            rootMargin,
            threshold
        });

        // Observe all registered sections
        sectionRefs.current.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, [rootMargin, threshold, onChange, ...dependencies]); // eslint-disable-line react-hooks/exhaustive-deps

    return {
        scrollRef,
        activeSection,
        direction,
        registerSection,
        scrollToSection,
        // Helper to get raw map if needed
        getSectionMap: () => sectionRefs.current
    };
};
