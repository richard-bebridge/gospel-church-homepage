import React, { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

const Section = ({ title, children, index, setActiveSection }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { margin: "-50% 0px -50% 0px" }); // Strict center trigger

    useEffect(() => {
        if (isInView) {
            setActiveSection(index);
        }
    }, [isInView, index, setActiveSection]);

    return (
        <div ref={ref} className="h-screen snap-start flex flex-col justify-center px-8 lg:px-24 border-b border-gray-200 last:border-0 py-24">
            <motion.div
                initial={{ opacity: 0, y: 100, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                viewport={{ once: false, amount: 0.3 }}
            >
                <h2 className="font-sans font-bold text-4xl md:text-6xl mb-12 leading-tight text-[#05121C] uppercase tracking-tight">{title}</h2>
                <div className="text-xl md:text-2xl text-[#05121C] leading-loose space-y-8 max-w-xl font-light font-korean">
                    {children}
                </div>
                <div className="mt-16 pt-8 border-t border-gray-300 w-24">
                    <div className="flex items-center gap-3 cursor-pointer group">
                        <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 text-[#05121C]" />
                        <span className="uppercase text-xs font-bold tracking-[0.2em] text-gray-500">Learn More</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const LeftPanel = ({ setActiveSection }) => {
    return (
        <div className="w-full lg:w-1/2 bg-[#F4F3EF]">

            {/* Hero Section - Side by Side Layout */}
            <div className="h-screen snap-start flex flex-col justify-center px-8 lg:px-12 xl:px-24 py-24">
                <motion.div
                    initial={{ opacity: 0, y: 100, filter: 'blur(10px)' }}
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 1.5 }}
                    viewport={{ once: false }}
                    className="grid grid-cols-1 gap-8"
                >
                    {/* English Title - "IN THE WORD," / "WE RISE." */}
                    <div>
                        <h1 className="font-sans font-bold text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.9] tracking-tighter text-[#05121C] uppercase">
                            In the Word,<br />
                            We Rise.
                        </h1>
                    </div>

                    {/* Korean Text - Right Aligned & Below Title */}
                    {/* Adjusted padding/margin to align visually with the end of "We Rise." */}
                    <div className="flex justify-end pt-12 pr-4 lg:pr-0">
                        <div className="space-y-6 text-2xl md:text-3xl font-light text-gray-600 leading-relaxed font-korean text-right max-w-md">
                            <p>말씀 안에서,</p>
                            <p>하나님을 찾고 그분 앞에 서며</p>
                            <p>새로워지는 사람들.</p>
                            <br />
                            <p>우리는, 그 여정 속에서</p>
                            <p>하나님을 드러냅니다.</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Sections */}
            <Section title="Live Beyond Walls" index={1} setActiveSection={setActiveSection}>
                <p>우리는 지역에 속하지 않습니다.</p>
                <p>복음으로 연결된 하나의 교회입니다.</p>
                <br />
                <p>교회는 건물이 아니라,</p>
                <p>하나님이 일하시는 공간입니다.</p>
            </Section>

            <Section title="Grow Through Every Step" index={2} setActiveSection={setActiveSection}>
                <p>우리는 여정의 진실함을,</p>
                <p>완성보다 변화를 소중히 여깁니다.</p>
                <br />
                <p>신앙은 답이 아니라,</p>
                <p>하나님을 따라 배우고 살아가는 길입니다.</p>
            </Section>

            <Section title="Seek. Stand. Transform. Radiate." index={3} setActiveSection={setActiveSection}>
                <p>우리는 숨 쉬듯 하나님을 구합니다.</p>
                <br />
                <p>그분 앞에 서며,</p>
                <p>말씀으로 새로워지고,</p>
                <p>세상 속에서 하늘을 드러냅니다.</p>
            </Section>

            <Section title="Walk With Us" index={4} setActiveSection={setActiveSection}>
                <p>우리는 완벽하지 않지만,</p>
                <p>하나님을 향해 걸음을 멈추지 않습니다.</p>
                <br />
                <p>이 여정 속에,</p>
                <p>당신의 걸음이 더해지길 바랍니다.</p>
            </Section>
        </div>
    );
};

export default LeftPanel;
