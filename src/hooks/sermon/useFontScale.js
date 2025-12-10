import { useState, useEffect } from 'react';
import { bodyTextClasses, verseTextClasses, desktopBodyClasses, desktopVerseClasses } from '../../components/sermon/constants';

export const useFontScale = () => {
    const [fontScale, setFontScale] = useState('normal');

    useEffect(() => {
        const savedScale = localStorage.getItem('fontScale');
        if (savedScale === 'large' || savedScale === 'normal') {
            setFontScale(savedScale);
        }
    }, []);

    const toggleFontScale = () => {
        const newScale = fontScale === 'normal' ? 'large' : 'normal';
        setFontScale(newScale);
        localStorage.setItem('fontScale', newScale);
    };

    return {
        fontScale,
        toggleFontScale,
        bodyTextClass: bodyTextClasses[fontScale],
        verseTextClass: verseTextClasses[fontScale],
        desktopBodyClass: desktopBodyClasses[fontScale],
        desktopVerseClass: desktopVerseClasses[fontScale]
    };
};
