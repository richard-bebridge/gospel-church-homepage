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
        <div className="min-h-screen bg-[#F4F3EF] flex flex-col">

            {/* Desktop Layout (>= md) */}
            <div className="hidden md:block w-full h-screen overflow-hidden">
                {/* 1. Right Panel (Fixed Position sibling) */}
                {/* 2. Main Scroll Container */}
                <div
                    id="scroll-container"
                    ref={scrollRef}
                    style={{
                        scrollPaddingTop: usePadding ? `${HEADER_HEIGHT_PX}px` : '0px',
                        paddingTop: usePadding ? `${HEADER_HEIGHT_PX}px` : '0px'
                    }}
                    className={`relative w-full h-full overflow-y-auto no-scrollbar scroll-smooth snap-y ${snapMode}`}
                >
                    {/* Sticky Overlay Wrapper for Right Panel (Enables Scroll Bubbling) */}
                    {rightPanel && (
                        <div className="sticky top-0 h-0 w-full z-40 overflow-visible pointer-events-none">
                            {/* Re-enable pointer events for specific interactive children inside RightPanelController */}
                            <div className="absolute top-0 right-0 w-full h-screen">
                                {rightPanel}
                            </div>
                        </div>
                    )}

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
