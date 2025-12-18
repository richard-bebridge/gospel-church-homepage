'use client';

import React from 'react';
import MessagesSummarySection from '../messages/MessagesSummarySection';
import { HEADER_HEIGHT_PX } from '../../lib/layout-metrics';

/**
 * PresentationSummary
 * 
 * Wrapper for the 'Messages Summary' section at the bottom of letters/sermons.
 * Enforces snap-start and min-height contracts.
 * 
 * Props:
 * - data: summary data object
 * - sectionRef: ref for scroll snap
 */
export const PresentationSummary = ({ data, sectionRef }) => {
    return (
        <section
            id="summary-section"
            ref={sectionRef}
            className="bg-[#F4F3EF] w-full relative z-20"
            style={{ minHeight: `calc(100vh - ${HEADER_HEIGHT_PX}px)` }}
        >
            {data && (
                <MessagesSummarySection
                    {...data}
                    reversed={true}
                />
            )}
        </section>
    );
};
