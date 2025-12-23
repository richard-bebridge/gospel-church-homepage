'use client';

import { useState, useEffect, useRef } from 'react';

const SCROLL_COOLDOWN_MS = 1200; // Time (ms) to wait after a snap before accepting new scrolls. Increase this if sections skip too fast.
const SCROLL_THRESHOLD_DELTA = 320; // Sensitivity (pixels). Higher = Harder to snap. Lower = Easier. Apple average flick is ~400-800.
const SYMBOL_SNAP_POSITION_RATIO = 0.8; // 0.5 = Center, 0.8 = Lower (80% down)

// Apple Scroll Info for User Reference:
// - Apple Magic Mouse/Trackpad generates inertial scroll events.
// - A single strong flick can generate a delta sum of 500-1500px over 1-2 seconds.
// - A gentle swipe sums to ~200px.
// - To prevent "Double Skipping" (flick triggering two sections), we use:
//   1. Cooldown (Wait for inertia to die down)
//   2. Threshold (Require significant movement to trigger next)

/**
 * useSnapScrollState
 * Unified hook for handling scroll-snap behavior, active index tracking, 
 * and footer detection across presentation pages.
 * 
 * @param {Array} sections - The sections to scroll through.
 * @param {Object} options - Configuration for refs and behavior.
 * @returns {Object} - Scroll state and refs.
 */
export const useSnapScrollState = (sections, { containerRef, sectionRefs, footerRef, internalRefs, onSnap }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const isAutoScrollingRef = useRef(false);
    const wheelAccumRef = useRef(0);
    const sectionEndSentinels = useRef([]);
    const isSectionEndVisible = useRef(false);

    // Track element heights for dynamic snapping
    const elementHeights = useRef({});

    const isFooter = activeIndex === sections.length;

    // Reset Inertia Helper
    const resetInertia = () => {
        wheelAccumRef.current = 0;
        // Optionally add a small delay to ignore trailing events
    };

    const performSnap = (targetIndex, targetTopOverride = null) => {
        if (!containerRef.current) return;
        if (targetIndex < 0 || targetIndex > sections.length) return;

        isAutoScrollingRef.current = true;
        resetInertia();

        // Only update index if we are moving to a new section (not just internal scroll)
        if (targetIndex !== activeIndex) {
            setActiveIndex(targetIndex);
            if (onSnap) onSnap(targetIndex);
        }

        let top = 0;
        if (targetTopOverride !== null) {
            top = targetTopOverride;
        } else if (targetIndex < sections.length) {
            const el = sectionRefs.current[targetIndex];
            if (el) top = el.offsetTop;
        } else if (footerRef?.current) {
            top = footerRef.current.offsetTop;
        }

        containerRef.current.scrollTo({
            top,
            behavior: 'smooth'
        });

        setTimeout(() => {
            isAutoScrollingRef.current = false;
            resetInertia();
        }, SCROLL_COOLDOWN_MS);
    };

    // Sentinel logic for end detection
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                isSectionEndVisible.current = entry.isIntersecting;
            },
            { root: containerRef.current, threshold: 0.1, rootMargin: '0px 0px -20px 0px' } // Tighter margin
        );

        if (activeIndex < sections.length) {
            const sentinel = sectionEndSentinels.current[activeIndex];
            if (sentinel) observer.observe(sentinel);
        }

        return () => observer.disconnect();
    }, [activeIndex, sections.length, containerRef]);

    // Height Observer for Internal Refs
    useEffect(() => {
        if (!internalRefs?.current) return;

        const observer = new ResizeObserver((entries) => {
            entries.forEach(entry => {
                // We can store heights if needed for complex calculations
                // For now, we calculate clientRect JIT in handleWheel
            });
        });

        // Observe populated internal refs
        internalRefs.current.forEach(el => {
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [internalRefs, sections]);


    // Wheel handling logic refactored
    const handleWheel = (e) => {
        const container = containerRef.current;
        if (!container) return;

        // Stop propagation if caught here to avoid parent conflicts
        // e.stopPropagation(); 

        if (isAutoScrollingRef.current) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        wheelAccumRef.current += e.deltaY;

        // Check threshold
        if (Math.abs(wheelAccumRef.current) < SCROLL_THRESHOLD_DELTA) {
            // For strict mode, we might want to block native scroll if we are "locked"
            // But for visit page (free scroll), we let it pass usually.
            // However, to prevent "jiggle", we rely on the threshold.
            // If we are at a boundary (top/bottom), we should prevent default if we plan to snap.

            const isDown = e.deltaY > 0;
            const isUp = e.deltaY < 0;

            // If trying to go down at bottom, or up at top - maybe block?
            // Leaving as passed-through for now, similar to previous logic.
            // Unless strict blocking is requested.
            return;
        }

        const isDown = wheelAccumRef.current > 0;
        const isUp = wheelAccumRef.current < 0;

        const currentSectionInternalRef = internalRefs?.current?.[activeIndex];

        if (isDown) {
            if (activeIndex < sections.length) {
                // 1. Check Internal Snap Point FIRST (Sequential: Content -> Symbol -> End)
                if (currentSectionInternalRef) {
                    const rect = currentSectionInternalRef.getBoundingClientRect();
                    const containerRect = container.getBoundingClientRect();

                    // Calculate "Center" or "Golden Ratio" target
                    const targetCenter = rect.top + rect.height / 2;
                    const containerCenter = containerRect.top + containerRect.height / 2;

                    // Use a vertical offset based on the requested Ratio (0.8) or Center (0.5)
                    // SYMBOL_SNAP_POSITION_RATIO = 0.8 means we want the symbol at 80% of viewport height?
                    // Or we want the snap to Position the symbol appropriately.
                    // Previous logic: targetTop = relativeTop - (containerH * Ratio) + (h/2)

                    const currentScrollTop = container.scrollTop;
                    const relativeTop = rect.top - containerRect.top + currentScrollTop;

                    // Dynamic Target: Center the symbol visually
                    const centeredTargetTop = relativeTop - (containerRect.height / 2) + (rect.height / 2);

                    // Check if we are "Above" the target significantly
                    // (i.e. we haven't reached the symbol yet)
                    // Tolerance: 50px
                    if (currentScrollTop < centeredTargetTop - 50) {
                        // We are above it. The user wants to go DOWN. 
                        // Check if the scroll WOULD take us past it?
                        // For now, we FORCE snap to it if we have accumulated delta.

                        e.preventDefault();
                        e.stopPropagation();

                        // We stay in SAME activeIndex, just scroll to internal point
                        performSnap(activeIndex, centeredTargetTop);
                        return;
                    }

                    // If we are Already At (or below) the symbol...
                    // Allow falling through to Section End Check.
                }

                // 2. Check Section End
                if (isSectionEndVisible.current) {
                    e.preventDefault();
                    e.stopPropagation();
                    performSnap(activeIndex + 1);
                } else {
                    // Reset accum if we didn't snap (user just scrolling content)
                    wheelAccumRef.current = 0;
                }
            } else {
                // Footer or End
                e.preventDefault();
            }
        } else if (isUp) {
            if (activeIndex > 0) {
                // We are trying to go UP to Previous Section.
                // 1. Check if we are at TOP of current section
                const el = sectionRefs.current[activeIndex];
                const isAtTop = el && Math.abs(container.scrollTop - el.offsetTop) < 50;

                if (isAtTop) {
                    e.preventDefault();
                    e.stopPropagation();

                    // 2. Logic: "Section Move -> Internal Points backwards"
                    // Move to Previous Section.
                    // BUT do we go to its TOP or its BOTTOM/SYMBOL?
                    // User Request: "When coming back up... internal points backwards".
                    // This implies: Next Section Top -> Prev Section Symbol -> Prev Section Top.
                    // So we check Prev Section Internal Ref.

                    const prevIndex = activeIndex - 1;
                    const prevInternalRef = internalRefs?.current?.[prevIndex];

                    if (prevInternalRef) {
                        // Calculate Snap Target for Prev Symbol
                        const rect = prevInternalRef.getBoundingClientRect();
                        const containerRect = container.getBoundingClientRect();
                        const currentScrollTop = container.scrollTop; // This is current (Section N Top)

                        // Note: rect is likely off-screen (above).
                        // We rely on offsetTop logic if possible, or relative calculation.
                        // Only safe way is if the element is rendered. It should be.

                        // Re-calculate target (Center)
                        // Since element is above, rect.top is negative relative to viewport.
                        // absoluteTop = currentScrollTop + rect.top (relative to viewport) - containerTop
                        const absoluteTop = currentScrollTop + (rect.top - containerRect.top);

                        const centeredTargetTop = absoluteTop - (containerRect.height / 2) + (rect.height / 2);

                        performSnap(prevIndex, centeredTargetTop);
                    } else {
                        // No internal ref, just go to Previous Section Top (Standard)
                        performSnap(prevIndex);
                    }
                    return;
                } else {
                    // User is scrolling UP inside the CURRENT section.
                    // Check if there is an INTERNAL ref above us in THIS section?
                    if (currentSectionInternalRef) {
                        const rect = currentSectionInternalRef.getBoundingClientRect();
                        const containerRect = container.getBoundingClientRect();
                        const currentScrollTop = container.scrollTop;

                        // Absolute position of symbol
                        const absoluteTop = currentScrollTop + (rect.top - containerRect.top);
                        const centeredTargetTop = absoluteTop - (containerRect.height / 2) + (rect.height / 2);

                        // If we are BELOW the symbol (scrollTop > target), snap BACK to it.
                        if (currentScrollTop > centeredTargetTop + 50) {
                            e.preventDefault();
                            e.stopPropagation();
                            performSnap(activeIndex, centeredTargetTop); // Stay in section, snap to symbol
                            return;
                        }
                    }

                    wheelAccumRef.current = 0;
                }
            } else {
                // At very top
                wheelAccumRef.current = 0;
            }
        }
    };

    // Attach listener
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => container.removeEventListener('wheel', handleWheel);
    }, [activeIndex, sections.length, containerRef, sectionRefs]);

    return {
        activeIndex,
        setActiveIndex,
        isFooter,
        performSnap,
        sectionEndSentinels,
        isSectionEndVisible,
        handleWheel
    };
};
