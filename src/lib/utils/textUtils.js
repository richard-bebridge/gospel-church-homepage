import React from 'react';

/**
 * Renders text with the first word styled larger/bold.
 * Used for Verse displays.
 */
export const renderVerseWithStyledFirstWord = (text) => {
    if (!text) return null;
    const parts = text.split(' ');
    const first = parts[0];
    const rest = parts.slice(1).join(' ');
    // We render this in React, so we return a fragment
    // Note: The classes matching the original implementation should be applied by the consumer or here?
    // Original: <span className="font-medium text-[1.6em]">{first}</span>{' '}{rest}
    return (
        <>
            <span className="font-medium" style={{ fontSize: '1.6em' }}>{first}</span>{' '}{rest}
        </>
    );
};
