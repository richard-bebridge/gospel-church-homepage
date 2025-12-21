import React from 'react';

/**
 * Renders text with the first word styled larger/bold.
 * Used for Verse displays.
 */
export const renderVerseWithStyledFirstWord = (text) => {
    if (!text) return null;
    const normalized = (text || "").normalize('NFC');
    const parts = normalized.split(' ');
    const first = parts[0];
    const rest = parts.slice(1).join(' ');
    return (
        <>
            <span className="font-medium" style={{ fontSize: '1.6em' }}>{first}</span>{' '}{rest}
        </>
    );
};
