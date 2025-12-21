'use client';

import { useState, useEffect, useRef } from 'react';

const SCROLL_COOLDOWN_MS = 1000;
const SCROLL_THRESHOLD_DELTA = 150;

/**
 * useSnapScrollState
 * Unified hook for handling scroll-snap behavior, active index tracking, 
 * and footer detection across presentation pages.
 * 
 * @param {Array} sections - The sections to scroll through.
 * @param {Object} options - Configuration for refs and behavior.
 * @returns {Object} - Scroll state and refs.
 */
export const useSnapScrollState = (sections, { containerRef, sectionRefs, footerRef, onSnap }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const isAutoScrollingRef = useRef(false);
    const wheelAccumRef = useRef(0);
    const sectionEndSentinels = useRef([]);
    const isSectionEndVisible = useRef(false);

    const isFooter = activeIndex === sections.length;

    const performSnap = (targetIndex) => {
        if (!containerRef.current) return;
        if (targetIndex < 0 || targetIndex > sections.length) return;

        isAutoScrollingRef.current = true;
        wheelAccumRef.current = 0;
        setActiveIndex(targetIndex);

        let top = 0;
        if (targetIndex < sections.length) {
            const el = sectionRefs.current[targetIndex];
            if (el) top = el.offsetTop;
        } else if (footerRef?.current) {
            top = footerRef.current.offsetTop;
        }

        containerRef.current.scrollTo({
            top,
            behavior: 'smooth'
        });

        if (onSnap) onSnap(targetIndex);

        setTimeout(() => {
            isAutoScrollingRef.current = false;
            wheelAccumRef.current = 0;
        }, SCROLL_COOLDOWN_MS);
    };

    // Sentinel logic for end detection
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                isSectionEndVisible.current = entry.isIntersecting;
            },
            { root: containerRef.current, threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
        );

        if (activeIndex < sections.length) {
            const sentinel = sectionEndSentinels.current[activeIndex];
            if (sentinel) observer.observe(sentinel);
        }

        return () => observer.disconnect();
    }, [activeIndex, sections.length, containerRef]);

    // Wheel handling
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e) => {
            if (isAutoScrollingRef.current) {
                e.preventDefault();
                return;
            }

            wheelAccumRef.current += e.deltaY;

            if (Math.abs(wheelAccumRef.current) < SCROLL_THRESHOLD_DELTA) {
                const isDown = e.deltaY > 0;
                const isUp = e.deltaY < 0;

                if (isDown && !isSectionEndVisible.current) return;

                if (activeIndex < sections.length) {
                    const el = sectionRefs.current[activeIndex];
                    if (el && isUp) {
                        const distFromTop = Math.abs(container.scrollTop - el.offsetTop);
                        if (distFromTop > 10) return;
                    }
                } else if (isUp) {
                    return;
                }

                e.preventDefault();
                return;
            }

            const isDown = wheelAccumRef.current > 0;
            const isUp = wheelAccumRef.current < 0;

            if (isDown) {
                if (activeIndex < sections.length) {
                    if (isSectionEndVisible.current) {
                        e.preventDefault();
                        performSnap(activeIndex + 1);
                    } else {
                        wheelAccumRef.current = 0;
                    }
                } else {
                    e.preventDefault();
                }
            } else if (isUp) {
                if (activeIndex > 0) {
                    if (activeIndex === sections.length) {
                        e.preventDefault();
                        performSnap(activeIndex - 1);
                    } else {
                        const el = sectionRefs.current[activeIndex];
                        if (el) {
                            const distFromTop = Math.abs(container.scrollTop - el.offsetTop);
                            if (distFromTop < 50) {
                                e.preventDefault();
                                performSnap(activeIndex - 1);
                            } else {
                                wheelAccumRef.current = 0;
                            }
                        }
                    }
                }
            }
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => container.removeEventListener('wheel', handleWheel);
    }, [activeIndex, sections.length, containerRef, sectionRefs]);

    return {
        activeIndex,
        setActiveIndex,
        isFooter,
        performSnap,
        sectionEndSentinels,
        isSectionEndVisible
    };
};
