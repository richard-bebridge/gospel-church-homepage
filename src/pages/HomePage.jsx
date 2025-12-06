import React, { useState } from 'react';
import Header from '../components/Header';
import LeftPanel from '../components/LeftPanel';
import Effect2 from '../components/effects/Effect2';
import Footer from '../components/Footer';

const HomePage = () => {
    const [activeSection, setActiveSection] = useState(0);

    return (
        <div className="h-screen min-h-[100dvh] bg-[#F4F3EF] snap-y snap-mandatory overflow-y-scroll">
            <Header />
            <div className="flex flex-col lg:flex-row relative">
                <LeftPanel setActiveSection={setActiveSection} />
                <div className="hidden lg:block w-1/2 sticky top-16 md:top-20 h-[calc(100dvh-4rem)] md:h-[calc(100dvh-5rem)]">
                    <Effect2 activeSection={activeSection} />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default HomePage;
