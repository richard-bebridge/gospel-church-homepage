import React, { useState } from 'react';
import Header from '../components/Header';
import LeftPanel from '../components/LeftPanel';
import Effect2 from '../components/effects/Effect2';
import Footer from '../components/Footer';

const HomePage = () => {
    const [activeSection, setActiveSection] = useState(0);

    return (
        <div className="h-screen bg-[#F4F3EF] snap-y snap-mandatory overflow-y-scroll">
            <Header />
            <div className="flex flex-col lg:flex-row relative">
                <LeftPanel setActiveSection={setActiveSection} />
                <div className="hidden lg:block w-1/2 sticky top-24 h-[calc(100vh-6rem)]">
                    <Effect2 activeSection={activeSection} />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default HomePage;
