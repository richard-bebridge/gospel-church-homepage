'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const AboutTOC = ({ sections, activeIndex, onSectionClick }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* --- Trigger Button --- */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed right-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all text-[#2A4458] shadow-sm ${isOpen ? 'hidden' : 'block'}`}
                aria-label="Table of Contents"
            >
                {/* Simple Dash or Icon */}
                <div className="flex flex-col gap-1 items-end">
                    <span className="w-6 h-0.5 bg-[#2A4458]" />
                    <span className="w-4 h-0.5 bg-[#2A4458]" />
                    <span className="w-5 h-0.5 bg-[#2A4458]" />
                </div>
            </button>

            {/* --- Overlay --- */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/5 z-[60] backdrop-blur-[2px]"
                        />

                        {/* TOC Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: '0%' }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed top-0 right-0 h-full w-[300px] md:w-[400px] bg-[#F4F4F0] z-[70] shadow-2xl p-12 flex flex-col overflow-y-auto border-l border-[#2A4458]/10"
                        >
                            <div className="flex justify-between items-center mb-12">
                                <span className="text-sm font-bold tracking-widest text-gray-400">TABLE OF CONTENTS</span>
                                <button onClick={() => setIsOpen(false)} className="text-[#2A4458] hover:opacity-50">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex flex-col gap-6">
                                {sections.map((section, idx) => {
                                    const isActive = idx === activeIndex;
                                    const number = String(idx + 1).padStart(2, '0');

                                    return (
                                        <button
                                            key={section.id}
                                            onClick={() => {
                                                onSectionClick(idx);
                                                // setIsOpen(false); // User preference: maybe keep open? Prompt says "TOC가 열린 상태에서도 스크롤 가능". So keep open.
                                            }}
                                            className={`text-left group flex items-baseline gap-4 py-2 transition-all ${isActive ? 'opacity-100' : 'opacity-40 hover:opacity-70'
                                                }`}
                                        >
                                            <span className={`font-yisunshin font-bold text-lg ${isActive ? 'text-[#2A4458]' : 'text-gray-500'}`}>
                                                {number}
                                            </span>
                                            <span className={`font-yisunshin font-bold text-2xl ${isActive ? 'text-[#1A1A1A]' : 'text-gray-800'}`}>
                                                {section.title}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default AboutTOC;
