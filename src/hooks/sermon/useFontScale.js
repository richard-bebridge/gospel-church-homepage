import { useState, useEffect } from 'react';
import { bodyTextClasses, verseTextClasses, desktopBodyClasses, desktopVerseClasses } from '../../components/sermon/constants';

// Inline styles for reliable font size override (bypasses Tailwind CSS issues)
const verseFontStyles = {
    normal: {},
    large: { fontSize: '24px', lineHeight: '1.625' },
    xl: { fontSize: '28px', lineHeight: '1.625' }
};

export const useFontScale = () => {
    const [fontScale, setFontScale] = useState('normal');
    const [isSettled, setIsSettled] = useState(false);

    useEffect(() => {
        const savedScale = localStorage.getItem('fontScale');
        if (savedScale === 'large' || savedScale === 'xl' || savedScale === 'normal') {
            setFontScale(savedScale);
        }
        setIsSettled(true);
    }, []);

    const toggleFontScale = () => {
        let newScale = 'normal';
        if (fontScale === 'normal') newScale = 'large';
        else if (fontScale === 'large') newScale = 'xl';
        else if (fontScale === 'xl') newScale = 'normal';

        setIsSettled(false);
        setFontScale(newScale);
        localStorage.setItem('fontScale', newScale);
        setTimeout(() => setIsSettled(true), 50);
    };

    return {
        fontScale,
        isSettled,
        toggleFontScale,
        bodyTextClass: bodyTextClasses[fontScale],
        verseTextClass: verseTextClasses[fontScale],
        desktopBodyClass: desktopBodyClasses[fontScale],
        desktopVerseClass: desktopVerseClasses[fontScale],
        verseStyle: verseFontStyles[fontScale] // NEW: inline style for verses
    };
};
