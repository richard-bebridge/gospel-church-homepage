'use client';

import React, { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

// Default Fallback Content (original hardcoded)
const DEFAULT_HERO = {
    titleEn: "In the Word,\nWe Rise.",
    koreanParagraphs: [
        "말씀 안에서,",
        "하나님을 찾고 그분 앞에 서며",
        "새로워지는 사람들.",
        "\n",
        "우리는, 그 여정 속에서",
        "하나님을 드러냅니다."
    ]
};

const DEFAULT_SECTIONS = [
    { titleEn: "Live Beyond Walls", subtitle: "WHO WE ARE", linkUrl: "/about", koreanParagraphs: ["우리는 지역에 속하지 않습니다.", "복음으로 연결된 하나의 교회입니다.", "\n", "교회는 건물이 아니라,", "하나님이 일하시는 공간입니다."] },
    { titleEn: "Grow Through Every Step", subtitle: "LIVING FAITH", linkUrl: "/about", koreanParagraphs: ["우리는 여정의 진실함을,", "완성보다 변화를 소중히 여깁니다.", "\n", "신앙은 답이 아니라,", "하나님을 따라 배우고 살아가는 길입니다."] },
    { titleEn: "Seek. Stand. Transform. Radiate.", subtitle: "OUR MISSION", linkUrl: "/about", koreanParagraphs: ["우리는 숨 쉬듯 하나님을 구합니다.", "\n", "그분 앞에 서며,", "말씀으로 새로워지고,", "세상 속에서 하늘을 드러냅니다."] },
    { titleEn: "Walk With Us", subtitle: "JOIN US", linkUrl: "/visit", koreanParagraphs: ["우리는 완벽하지 않지만,", "하나님을 향해 걸음을 멈추지 않습니다.", "\n", "이 여정 속에,", "당신의 걸음이 더해지길 바랍니다."] }
];

const Section = ({ title, subtitle, paragraphs, index, setActiveSection, linkUrl }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { margin: "-50% 0px -50% 0px" });

    useEffect(() => {
        if (isInView) {
            setActiveSection(index);
        }
    }, [isInView, index, setActiveSection]);

    // Wrapper for Link or Div based on whether linkUrl exists
    const SubtitleWrapper = linkUrl ? Link : 'div';
    const linkProps = linkUrl ? { href: linkUrl } : {};

    return (
        <div ref={ref} className="h-screen min-h-[100dvh] snap-start flex flex-col justify-center px-6 sm:px-8 lg:pl-[10vw] lg:pr-24 border-b border-gray-200 last:border-0 py-16 sm:py-20 md:py-24 pt-[calc(6rem+env(safe-area-inset-top))] pb-[calc(4rem+env(safe-area-inset-bottom))]">
            <motion.h2
                className="font-english font-bold text-4xl sm:text-4xl md:text-6xl mb-8 sm:mb-12 md:mb-16 leading-tight text-[#05121C] uppercase tracking-tight"
                initial={{ opacity: 0, y: 100, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                viewport={{ once: false, amount: 0.3 }}
            >
                {title}
            </motion.h2>

            <motion.div
                className="text-xl sm:text-xl md:text-2xl text-[#05121C] leading-relaxed sm:leading-loose space-y-4 sm:space-y-6 md:space-y-8 max-w-xl font-light font-korean"
                initial={{ opacity: 0, y: 100, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                viewport={{ once: false, amount: 0.3 }}
            >
                {paragraphs.map((p, idx) => <p key={idx} className="whitespace-pre-line">{p}</p>)}
            </motion.div>

            <motion.div
                className="mt-8 sm:mt-12 md:mt-16"
                initial={{ opacity: 0, y: 100, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }}
                viewport={{ once: false, amount: 0.3 }}
            >
                <SubtitleWrapper {...linkProps} className="inline-flex items-center gap-4 cursor-pointer group">
                    <ArrowUpRight className="w-6 h-6 sm:w-8 sm:h-8 text-[#2A4458] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    <span className="font-english font-bold text-sm sm:text-sm tracking-wide text-[#2A4458] uppercase">
                        {subtitle}
                    </span>
                </SubtitleWrapper>
            </motion.div>
        </div>
    );
};

const LeftPanel = ({ setActiveSection, sections = [] }) => {
    const heroRef = useRef(null);
    const heroInView = useInView(heroRef, { margin: "-50% 0px -50% 0px" });

    useEffect(() => {
        if (heroInView) {
            setActiveSection(0);
        }
    }, [heroInView, setActiveSection]);

    // Data Resolution
    const hasData = sections && sections.length > 0;
    const heroData = hasData ? sections[0] : DEFAULT_HERO;
    const listData = hasData ? sections.slice(1) : DEFAULT_SECTIONS;

    return (
        <div className="w-full lg:w-1/2 bg-[#F4F3EF]">
            {/* Hero Section */}
            <div ref={heroRef} className="h-screen min-h-[100dvh] snap-start flex flex-col justify-center px-6 sm:px-8 lg:pl-[10vw] lg:pr-24 py-16 sm:py-20 md:py-24 pt-[calc(8rem+env(safe-area-inset-top))] pb-[calc(4rem+env(safe-area-inset-bottom))]">
                <div className="grid grid-cols-1 gap-6 sm:gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 100, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 1.5 }}
                    >
                        <h1 className="font-english font-bold text-5xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl leading-[0.9] tracking-tighter text-[#05121C] uppercase whitespace-pre-line">
                            {heroData.titleEn}
                        </h1>
                    </motion.div>

                    <motion.div
                        className="flex justify-end pt-8 sm:pt-12 pr-4 lg:pr-0"
                        initial={{ opacity: 0, y: 100, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 1.5, delay: 0.4 }}
                    >
                        <div className="space-y-3 sm:space-y-4 md:space-y-6 text-xl sm:text-xl md:text-2xl font-light text-[#05121C] leading-relaxed font-korean text-right max-w-md">
                            {heroData.koreanParagraphs.map((p, idx) => <p key={idx} className="whitespace-pre-line">{p}</p>)}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* List Sections */}
            {listData.map((section, idx) => (
                <Section
                    key={section.id || idx}
                    index={idx + 1}
                    title={section.titleEn}
                    subtitle={section.subtitle || section.linkLabel}
                    paragraphs={section.koreanParagraphs}
                    linkUrl={section.linkUrl}
                    setActiveSection={setActiveSection}
                />
            ))}
        </div>
    );
};

export default LeftPanel;
