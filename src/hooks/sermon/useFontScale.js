import { useState, useEffect } from 'react';
import { bodyTextClasses, verseTextClasses, desktopBodyClasses, desktopVerseClasses } from '../../components/sermon/constants';

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

        setIsSettled(false);
        setFontScale(newScale);
        localStorage.setItem('fontScale', newScale);
        setTimeout(() => setIsSettled(true), 50); // Brief delay for layout re-calc
    };

    return {
        fontScale,
        isSettled,
        toggleFontScale,
        bodyTextClass: bodyTextClasses[fontScale],
        verseTextClass: verseTextClasses[fontScale],
        desktopBodyClass: desktopBodyClasses[fontScale],
        desktopVerseClass: desktopVerseClasses[fontScale]
    };
};
