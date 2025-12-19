'use client';

import React from 'react';
import NotionRenderer from '../sermon/NotionRenderer';
import { useFontScale } from '../../hooks/sermon/useFontScale'; // Or pass as prop? 
// Be careful with hooks inside shared components if context differs. 
// But font scale is globalish. 
// User prompt says: "PresentationBody... NotionRenderer call". 
// I'll pass bodyClass as prop to allow parent to control typography/scale state.

/**
 * PresentationBody
 * 
 * Main content area.
 * Renders list of Notion blocks in the standard "Left Column" layout.
 * 
 * Props:
 * - content: Array of Notion blocks
 * - bodyClass: string (Tailwind class string for text styling)
 * - endRef: ref/callback for the "End of Content" snap target
 */
export const PresentationBody = ({ content, bodyClass, endRef, paddingTop = 'pt-96' }) => {
    return (
        <div className="flex flex-row w-full z-20">
            {/* Left Column (Content) */}
            <div className="w-1/2 flex flex-col items-center">
                <div className={`w-full max-w-[60%] pb-32 ${paddingTop}`}>
                    {content && content.map(block => {
                        const isBullet = block.type === 'bulleted_list_item';
                        const spacingClass = isBullet ? 'mb-0' : 'mb-8';

                        return (
                            <div key={block.id} className={`${bodyClass} ${spacingClass}`}>
                                <NotionRenderer block={block} />
                            </div>
                        );
                    })}

                    {/* Snap Target for "End of Letter/Body" */}
                    {endRef && (
                        <div ref={endRef} className="h-px w-full" aria-hidden="true" />
                    )}

                    {/* Breathing Space (50vh) */}
                    <div className="h-[50vh] w-full" aria-hidden="true" />
                </div>
            </div>

            {/* Right Column (Empty) */}
            <div className="w-1/2" />
        </div>
    );
};
