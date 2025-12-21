'use client';

import React from 'react';

/**
 * PresentationHeader
 * 
 * Sticky Header Area within the scroll container.
 * Typically contains the Page Title with a gradient fade background.
 * 
 * Props:
 * - title: string
 * - subtitle: string (optional)
 * - gradientParams: object (optional config for gradients)
 */
export const PresentationHeader = ({ title, subtitle, paddingTop = 'pt-24' }) => {
    return (
        <div className="absolute top-0 left-0 z-30 flex flex-row w-full pointer-events-none">
            {/* Left Column (Main Content Side) */}
            <div className="w-1/2 relative pointer-events-auto flex flex-col items-center">
                {/* Gradient Background (Fade) */}
                <div className="absolute inset-0 w-full h-[300px] bg-gradient-to-b from-[#F4F3EF] via-[#F4F3EF] via-80% to-transparent z-0" />

                {/* Title Content */}
                {/* Offset: Custom padding or default pt-24 (96px) */}
                <div className={`relative z-10 w-full max-w-[60%] ${paddingTop}`}>
                    {subtitle && (
                        <span className="text-[#2A4458] font-english font-bold text-sm tracking-widest uppercase mb-6 block">
                            {subtitle}
                        </span>
                    )}
                    <h1 className="text-5xl md:text-6xl font-bold font-korean text-[#05121C] leading-tight break-keep">
                        {title}
                    </h1>
                </div>
            </div>

            {/* Right Column (Empty / Covered by Right Panel) */}
            <div className="w-1/2" />
        </div>
    );
};
