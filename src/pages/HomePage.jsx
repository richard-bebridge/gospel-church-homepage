import React, { useState } from 'react';
import Header from '../components/Header';
import LeftPanel from '../components/LeftPanel';
import RightPanel from '../components/RightPanel';
import Footer from '../components/Footer';

const HomePage = () => {
    const [activeSection, setActiveSection] = useState(0);

    return (
        <div className="h-screen bg-[#F4F3EF] snap-y snap-mandatory overflow-y-scroll">
            <Header />
            <div className="flex flex-col lg:flex-row pt-24 relative">
                <LeftPanel setActiveSection={setActiveSection} />
                <RightPanel activeSection={activeSection} />
            </div>
            <Footer />
        </div>
    );
};

export default HomePage;
