import React from 'react';

/**
 * Renders text with the first word styled larger/bold.
 * Used for Verse displays.
 */
export const renderVerseWithStyledFirstWord = (text) => {
    if (!text) return null;
    const normalized = (text || "").normalize('NFC');

    // Split by first whitespace to isolate the first word
    // This preserves subsequent whitespace/newlines in 'rest'
    const match = normalized.match(/(\s+)/);

    if (!match) {
        return <span className="font-medium" style={{ fontSize: '1.6em' }}>{normalized}</span>;
    }

    const firstSpaceIndex = match.index;
    const first = normalized.substring(0, firstSpaceIndex);
    const rest = normalized.substring(firstSpaceIndex);

    return (
        <span className="whitespace-pre-line">
            <span className="font-medium" style={{ fontSize: '1.6em', lineHeight: '1' }}>{first}</span>
            {rest}
        </span>
    );
};
