'use client';

import React from 'react';
import {
    HEADER_HEIGHT_PX,
    SCROLL_AREA_HEIGHT_STYLE,
    SCROLL_PADDING_TOP_STYLE
} from '../../lib/layout-metrics';

/**
 * PresentationShell
 * 
 * Top-level layout wrapper for "Presentation" pages (Sermons, Letters).
 * Enforces:
 * - Fixed Header Offset (80px)
 * - Scroll Container Styles (100vh - 80px)
 * - Desktop/Mobile structural split
 * 
 * Props:
 * - rightPanel: The Fixed Right Panel element (Desktop only)
 * - mobileContent: The Mobile Layout element
 * - scrollRef: Ref for the desktop scroll container
 */
export const PresentationShell = ({
    children,
    rightPanel,
    mobileContent,
    scrollRef,
    usePadding = true,
    snapMode = 'snap-proximity'
}) => {
    return (
        <div className="min-h-screen bg-[#F4F3EF] flex flex-col font-pretendard">

            {/* Desktop Layout (>= md) */}
            <div className="hidden md:block w-full">
                {/* 1. Header Buffer to push content below fixed nav */}
                <div style={{ height: `${HEADER_HEIGHT_PX}px` }} className="w-full shrink-0" />

                {/* 2. Right Panel (Fixed Position sibling) */}
                {rightPanel}

                {/* 3. Main Scroll Container */}
                <div
                    id="scroll-container"
                    ref={scrollRef}
                    style={{
                        ...SCROLL_AREA_HEIGHT_STYLE,
                        ...SCROLL_PADDING_TOP_STYLE,
                        paddingTop: usePadding ? `${HEADER_HEIGHT_PX}px` : '0px'
                    }}
                    className={`relative overflow-y-auto no-scrollbar scroll-smooth snap-y ${snapMode}`}
                >
                    {children}
                </div>
            </div>

            {/* Mobile Layout (< md) */}
            {mobileContent && (
                <div className="md:hidden flex flex-col w-full">
                    {mobileContent}
                </div>
            )}
        </div>
    );
};
