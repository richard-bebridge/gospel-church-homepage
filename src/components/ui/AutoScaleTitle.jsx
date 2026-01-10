'use client';

import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';

// Safe useLayoutEffect for SSR
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * AutoScaleTitle
 * Renders text that scales down if it exceeds maxLines.
 * 
 * @param {string} text - The title text
 * @param {string} className - Base classes
 * @param {number} maxLines - Max allowed lines before scaling
 * @param {string[]} scales - Array of Tailwind text size classes to try in order. First one should be empty (default).
 */
const AutoScaleTitle = ({
    text,
    className,
    maxLines = 2,
    scales = ['', 'text-[56px]', 'text-[48px]', 'text-[40px]', 'text-[32px]'],
    tag = 'h1'
}) => {
    const ref = useRef(null);
    const [scaleIndex, setScaleIndex] = useState(0);

    useIsomorphicLayoutEffect(() => {
        // Reset to default when text changes
        setScaleIndex(0);
    }, [text]);

    useIsomorphicLayoutEffect(() => {
        const checkOverflow = () => {
            const el = ref.current;
            if (!el) return;

            // Current Scale Class is applied. Check height.
            const style = window.getComputedStyle(el);
            const lineHeight = parseFloat(style.lineHeight);
            const height = el.clientHeight;

            // If lineHeight is invalid or normal (can be string "normal"), approximate or skip
            // "normal" is usually ~1.2em.
            let numericLineHeight = lineHeight;
            if (isNaN(lineHeight)) {
                const fontSize = parseFloat(style.fontSize);
                numericLineHeight = fontSize * 1.2;
            }

            const lines = Math.round(height / numericLineHeight);

            if (lines > maxLines && scaleIndex < scales.length - 1) {
                // Too big, try next smaller size
                setScaleIndex(prev => prev + 1);
            }
        };

        // Run check
        checkOverflow();

        // Optional: Re-check on resize (throttled logic ideally, but React might handle it via state)
        // If we downscale, we usually don't want to upscale back unless reset.
        // But for resize, we might want to reset. 
        // For now, complex reset logic is ommitted to avoid loops. 
        // We only scale DOWN.
    }, [text, scaleIndex, maxLines, scales]);

    // Construct final class
    // We append the scale class at the end to override base size
    // Note: If base class has !important or high specificity, this might fail.
    // But usually Tailwind utility classes override each other if defined later.
    // However, `text-[64px]` vs `text-[56px]`.
    // We should ensure the new class is applied.

    // Combining:
    const activeScale = scales[scaleIndex] || '';
    const appliedClass = `${className || ''} ${activeScale}`.trim();

    const Tag = tag;

    return (
        <Tag
            ref={ref}
            className={appliedClass}
            style={activeScale ? {} : undefined} // If we use classes, no style needed. 
        >
            {text}
        </Tag>
    );
};

export default AutoScaleTitle;
