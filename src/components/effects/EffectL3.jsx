import React, { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

const Section = ({ title, subtitle, children, index, setActiveSection }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { margin: "-50% 0px -50% 0px" }); // Strict center trigger

    useEffect(() => {
        if (isInView) {
            setActiveSection(index);
        }
    }, [isInView, index, setActiveSection]);

    return (
        <div ref={ref} className="h-screen min-h-[100dvh] snap-start flex flex-col justify-center px-6 sm:px-8 lg:px-24 border-b border-gray-200 last:border-0 py-16 sm:py-20 md:py-24 pt-[calc(6rem+env(safe-area-inset-top))] pb-[calc(4rem+env(safe-area-inset-bottom))]">
            {/* Title appears first */}
            <motion.h2
                className="font-sans font-bold text-3xl sm:text-4xl md:text-6xl mb-8 sm:mb-12 md:mb-16 leading-tight text-[#05121C] uppercase tracking-tight"
                initial={{ opacity: 0, y: 100, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                viewport={{ once: false, amount: 0.3 }}
            >
                {title}
            </motion.h2>

            {/* Content appears after title with delay */}
            <motion.div
                className="text-lg sm:text-xl md:text-2xl text-[#05121C] leading-relaxed sm:leading-loose space-y-4 sm:space-y-6 md:space-y-8 max-w-xl font-light font-korean"
                initial={{ opacity: 0, y: 100, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                viewport={{ once: false, amount: 0.3 }}
            >
                {children}
            </motion.div>

            {/* Subtitle and arrow appear last */}
            <motion.div
                className="mt-8 sm:mt-12 md:mt-16 flex items-center gap-4 cursor-pointer group"
                initial={{ opacity: 0, y: 100, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }}
                viewport={{ once: false, amount: 0.3 }}
            >
                <ArrowUpRight className="w-6 h-6 sm:w-8 sm:h-8 text-[#2A4458] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                <span className="font-sans font-bold text-xs sm:text-sm tracking-wide text-[#2A4458]">{subtitle}</span>
            </motion.div>
        </div>
    );
};

const EffectL3 = ({ setActiveSection }) => {
    const heroRef = useRef(null);
    const heroInView = useInView(heroRef, { margin: "-50% 0px -50% 0px" });

    useEffect(() => {
        if (heroInView) {
            setActiveSection(0);
        }
    }, [heroInView, setActiveSection]);

    return (
        <div className="w-full lg:w-1/2 bg-[#F4F3EF]">

            {/* Hero Section - Side by Side Layout */}
            <div ref={heroRef} className="h-screen min-h-[100dvh] snap-start flex flex-col justify-center px-6 sm:px-8 lg:px-24 py-16 sm:py-20 md:py-24 pt-[calc(8rem+env(safe-area-inset-top))] pb-[calc(4rem+env(safe-area-inset-bottom))]">
                <div className="grid grid-cols-1 gap-6 sm:gap-8">
                    {/* English Title - appears first */}
                    <motion.div
                        initial={{ opacity: 0, y: 100, filter: 'blur(10px)' }}
                        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 1.5 }}
                        viewport={{ once: false }}
                    >
                        <h1 className="font-sans font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.9] tracking-tighter text-[#05121C] uppercase">
                            In the Word,<br />
                            We Rise.
                        </h1>
                    </motion.div>

                    {/* Korean Text - appears after with delay */}
                    <motion.div
                        className="flex justify-end pt-8 sm:pt-12 pr-4 lg:pr-0"
                        initial={{ opacity: 0, y: 100, filter: 'blur(10px)' }}
                        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 1.5, delay: 0.4 }}
                        viewport={{ once: false }}
                    >
                        <div className="space-y-3 sm:space-y-4 md:space-y-6 text-lg sm:text-xl md:text-2xl font-light text-[#05121C] leading-relaxed font-korean text-right max-w-md">
                            <p>말씀 안에서,</p>
                            <p>하나님을 찾고 그분 앞에 서며</p>
                            <p>새로워지는 사람들.</p>
                            <br />
                            <p>우리는, 그 여정 속에서</p>
                            <p>하나님을 드러냅니다.</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Sections */}
            <Section title="Live Beyond Walls" subtitle="WHO WE ARE" index={1} setActiveSection={setActiveSection}>
                <p>우리는 지역에 속하지 않습니다.</p>
                <p>복음으로 연결된 하나의 교회입니다.</p>
                <br />
                <p>교회는 건물이 아니라,</p>
                <p>하나님이 일하시는 공간입니다.</p>
            </Section>

            <Section title="Grow Through Every Step" subtitle="LIVING FAITH" index={2} setActiveSection={setActiveSection}>
                <p>우리는 여정의 진실함을,</p>
                <p>완성보다 변화를 소중히 여깁니다.</p>
                <br />
                <p>신앙은 답이 아니라,</p>
                <p>하나님을 따라 배우고 살아가는 길입니다.</p>
            </Section>

            <Section title="Seek. Stand. Transform. Radiate." subtitle="OUR MISSION" index={3} setActiveSection={setActiveSection}>
                <p>우리는 숨 쉬듯 하나님을 구합니다.</p>
                <br />
                <p>그분 앞에 서며,</p>
                <p>말씀으로 새로워지고,</p>
                <p>세상 속에서 하늘을 드러냅니다.</p>
            </Section>

            <Section title="Walk With Us" subtitle="JOIN US" index={4} setActiveSection={setActiveSection}>
                {/* <br /> */}
                <p>우리는 완벽하지 않지만,</p>
                <p>하나님을 향해 걸음을 멈추지 않습니다.</p>
                <br />
                <p>이 여정 속에,</p>
                <p>당신의 걸음이 더해지길 바랍니다.</p>
            </Section>
        </div>
    );
};

export default EffectL3;
