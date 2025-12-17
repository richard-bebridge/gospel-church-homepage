'use client';

import React from 'react';
import { motion } from 'framer-motion';

const AboutSideNav = ({ sections, activeIndex, onSectionClick }) => {
    return (
        <div className="flex flex-col gap-1.5 items-end pr-8">
            {sections.map((section, idx) => {
                const isActive = idx === activeIndex;

                return (
                    <button
                        key={section.id}
                        onClick={() => onSectionClick(idx)}
                        className="group flex items-center justify-end py-1"
                        aria-label={`Go to section ${idx + 1}`}
                    >
                        {/* Optional Tooltip on Hover? */}
                        {/* <span className="mr-4 text-xs font-bold text-[#2A4458] opacity-0 group-hover:opacity-100 transition-opacity">
                             {String(idx + 1).padStart(2, '0')}
                         </span> */}

                        <motion.div
                            initial={false}
                            animate={{
                                width: isActive ? 20 : 12,
                                height: isActive ? 2 : 1, // Active: 2px, Inactive: 1px
                                opacity: isActive ? 1 : 0.3,
                                backgroundColor: isActive ? '#2A4458' : '#2A4458'
                            }}
                            className="rounded-full transition-colors duration-300"
                        />
                    </button>
                );
            })}
        </div>
    );
};

export default AboutSideNav;
