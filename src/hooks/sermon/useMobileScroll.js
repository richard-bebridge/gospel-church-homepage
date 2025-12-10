import { useState } from 'react';

export const useMobileScroll = () => {
    const [currentMobileSection, setCurrentMobileSection] = useState(0);

    const handleHorizontalScroll = (e) => {
        const container = e.currentTarget;
        const newSection = Math.round(container.scrollLeft / container.clientWidth);

        if (newSection !== currentMobileSection) {
            setCurrentMobileSection(newSection);
            window.scrollTo({ top: 0, behavior: 'instant' });
        }
    };

    return {
        currentMobileSection,
        handleHorizontalScroll
    };
};
