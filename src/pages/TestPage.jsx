import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import LeftPanel from '../components/LeftPanel';
import TestRightPanel from '../components/TestRightPanel';
import Footer from '../components/Footer';

const TestPage = () => {
    const [activeSection, setActiveSection] = useState(0);

    // Scroll listener to determine active section (same as HomePage)
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            const sectionIndex = Math.floor((scrollPosition + (windowHeight / 2)) / windowHeight);
            setActiveSection(sectionIndex);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="h-screen bg-[#F4F3EF] text-[#05121C] font-sans selection:bg-[#05121C] selection:text-white snap-y snap-mandatory overflow-y-scroll">
            <Header />

            <main className="relative flex flex-col lg:flex-row">
                <LeftPanel setActiveSection={setActiveSection} />
                <TestRightPanel activeSection={activeSection} />
            </main>

            <Footer />
        </div>
    );
};

export default TestPage;
