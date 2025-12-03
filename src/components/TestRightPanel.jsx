import React, { useState, useEffect } from 'react';
import Effect1 from './effects/Effect1';
import Effect2 from './effects/Effect2';
import Effect3 from './effects/Effect3';
import Effect4 from './effects/Effect4';
import Effect5 from './effects/Effect5';

const TestRightPanel = ({ activeSection }) => {
    const [mode, setMode] = useState(1);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === '1') setMode(1);
            if (e.key === '2') setMode(2);
            if (e.key === '3') setMode(3);
            if (e.key === '4') setMode(4);
            if (e.key === '5') setMode(5);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="hidden lg:block w-1/2 sticky top-0 h-screen border-l border-gray-200 bg-[#F4F3EF]">
            {mode === 1 && <Effect1 activeSection={activeSection} />}
            {mode === 2 && <Effect2 activeSection={activeSection} />}
            {mode === 3 && <Effect3 />}
            {mode === 4 && <Effect4 activeSection={activeSection} />}
            {mode === 5 && <Effect5 activeSection={activeSection} />}
        </div>
    );
};

export default TestRightPanel;
