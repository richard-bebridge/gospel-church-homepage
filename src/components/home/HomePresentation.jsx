'use client';

import React, { useState } from 'react';
import Header from '../Header';
import LeftPanel from '../LeftPanel';
import RightPanel from '../RightPanel';
import Footer from '../Footer';

const HomePresentation = ({ siteSettings }) => {
    const [activeSection, setActiveSection] = useState(0);

    return (
        <div className="h-screen min-h-[100dvh] bg-[#F4F3EF] snap-y snap-mandatory overflow-y-scroll">
            <Header siteSettings={siteSettings} />
            <div className="flex flex-col lg:flex-row relative">
                <LeftPanel setActiveSection={setActiveSection} />
                <div className="hidden lg:block w-1/2 sticky top-16 md:top-20 h-[calc(100dvh-4rem)] md:h-[calc(100dvh-5rem)]">
                    <RightPanel activeSection={activeSection} />
                </div>
            </div>
            <Footer siteSettings={siteSettings} />
        </div>
    );
};

export default HomePresentation;
