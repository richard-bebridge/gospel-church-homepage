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
            {/* Extended SEO Keywords for Naver & Google */}
            <p className="sr-only">
                서초구에 위치한 가스펠교회는 말씀 중심의 복음적인 교회로, 예배와 공동체를 통해 하나님을 찾고 삶 속에서 그분을 드러내는 신앙 공동체입니다. 서초구 교회, 서초동 교회, 교대역 교회, 서울 서초구 예배, 말씀 중심 교회, 복음적인 교회, 성경 설교, 주일예배, 소그룹 모임, 첫 방문 환영, 신앙 성장, 가족 교회, 청년 모임, 지역 교회 추천.
            </p>
            <p className="sr-only">
                Gospel Church is a Bible-centered Christian church located in Seocho-gu, Seoul. We are a gospel-focused community dedicated to seeking God through His Word, growing in faith, and living out the gospel in everyday life. Join us for Sunday worship, small group gatherings, and a welcoming faith community in the heart of Seocho.
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
