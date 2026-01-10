'use client';

import React, { useState } from 'react';
import Header from '../Header';
import LeftPanel from '../LeftPanel';
import RightPanel from '../RightPanel';
import Footer from '../Footer';

const HomePresentation = ({ siteSettings, sections }) => {
    const [activeSection, setActiveSection] = useState(0);

    return (
        <div className="h-screen min-h-[100dvh] bg-[#F4F3EF] snap-y snap-mandatory overflow-y-scroll">
            <h1 className="sr-only">가스펠교회 | 말씀 안에서 하나님을 찾는 공동체</h1>
            <p className="sr-only">
                가스펠교회는 건물이 아닌, 복음으로 연결된 하나의 교회입니다.
                말씀 안에서 하나님을 찾고, 그분 앞에 서며, 삶 속에서 하나님을 드러내는 공동체입니다.
            </p>
            <Header siteSettings={siteSettings} />
            <div className="flex flex-col lg:flex-row relative">
                <LeftPanel setActiveSection={setActiveSection} sections={sections} />
                <div className="hidden lg:block w-1/2 sticky top-16 md:top-20 h-[calc(100dvh-4rem)] md:h-[calc(100dvh-5rem)]">
                    <RightPanel activeSection={activeSection} sections={sections} />
                </div>
            </div>
            <Footer siteSettings={siteSettings} />
        </div>
    );
};

export default HomePresentation;
