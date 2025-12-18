'use client';

import React from 'react';

/**
 * PresentationFooter
 * 
 * Wrapper for the footer content.
 * 
 * Props:
 * - children: footer content
 * - sectionRef: ref for scroll snap
 */
export const PresentationFooter = ({ children, sectionRef }) => {
    return (
        <section
            id="footer-section"
            ref={sectionRef}
            className="w-full relative z-30"
        >
            {children}
        </section>
    );
};
