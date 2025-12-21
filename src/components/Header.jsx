'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Youtube, Instagram, Facebook } from 'lucide-react';
import Lottie from 'lottie-react';
import Link from 'next/link';
import Image from 'next/image';

const Header = ({ siteSettings }) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // Use settings or fallback
    const sns = siteSettings?.sns || {};
    const lottieRef = useRef(null);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    // Handle animation complete - pause for 3 seconds then restart
    const handleAnimationComplete = () => {
        if (lottieRef.current) {
            lottieRef.current.pause();
            setTimeout(() => {
                if (lottieRef.current) {
                    lottieRef.current.goToAndPlay(0);
                }
            }, 3000);
        }
    };

    const menuItems = [
        { label: 'About', href: '/about' },
        { label: 'Messages', href: '/messages' },
        { label: 'Visit', href: '/visit' },
        { label: 'Print', href: '/print' },
        { label: 'Test', href: '/test/typography' },
    ];

    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <>
            <header className="fixed top-0 left-0 w-full h-16 md:h-20 px-6 sm:px-8 md:px-[10%] flex justify-between items-center bg-[#05121C] z-[110]">
                {/* Logo - Lottie Animation */}
                <Link href="/" className="flex items-center gap-3">
                    <div className="h-8 md:h-14 w-auto" style={{ filter: 'brightness(0) invert(1)' }}>
                        {mounted && (
                            <Lottie
                                lottieRef={lottieRef}
                                path="/assets/symbol_animation.json"
                                loop={false}
                                autoplay={true}
                                onComplete={handleAnimationComplete}
                                style={{ height: '100%', width: 'auto' }}
                            />
                        )}
                    </div>
                    {/* <span className="hidden sm:block text-white font-english font-bold text-sm md:text-base tracking-wider uppercase">Gospel Church</span> */}
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                    {menuItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="text-sm font-english font-bold tracking-wide hover:text-[#5F94BD] transition-colors uppercase text-white"
                            suppressHydrationWarning
                        >
                            {mounted ? item.label : ''}
                        </Link>
                    ))}

                    {/* Desktop Social Icons */}
                    <div className="flex items-center gap-4 ml-2 pl-6 border-l border-white/10">
                        <a href={sns.instagram || "#"} target="_blank" rel="noopener noreferrer" className="text-[#5F94BD] hover:text-white transition-colors">
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a href={sns.youtube || "#"} target="_blank" rel="noopener noreferrer" className="text-[#5F94BD] hover:text-white transition-colors">
                            <Youtube className="w-5 h-5" />
                        </a>
                        <a href={sns.facebook || "#"} target="_blank" rel="noopener noreferrer" className="text-[#5F94BD] hover:text-white transition-colors">
                            <Facebook className="w-5 h-5" />
                        </a>
                    </div>
                </nav>

                {/* Mobile Hamburger Button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden flex items-center justify-center w-10 h-10 text-white hover:text-[#5F94BD] transition-colors"
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </header>

            {/* Mobile Menu Overlay - Full Screen */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-[#F4F3EF] z-[120] md:hidden overflow-y-auto"
                    >
                        {/* Header with Close Button */}
                        <div className="flex justify-end items-center px-6 sm:px-8 py-4 pt-[calc(1rem+env(safe-area-inset-top))]">
                            {/* Close Button */}
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1, duration: 0.3 }}
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center justify-center w-12 h-12 text-[#05121C] hover:text-[#5F94BD] transition-colors"
                                aria-label="Close menu"
                            >
                                <X className="w-8 h-8" />
                            </motion.button>
                        </div>

                        {/* Menu Items - Full Height */}
                        <nav className="flex flex-col px-6 sm:px-8 py-2 min-h-[calc(100vh-6rem)]">
                            {menuItems.map((item, index) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        opacity: { delay: 0.05 + index * 0.2, duration: 0.1 },
                                        y: { delay: 0.0 + index * 0.2, duration: 0.3, ease: "easeInOut" }
                                    }}
                                >
                                    <Link
                                        href={item.href}
                                        onClick={handleLinkClick}
                                        className="text-2xl font-bold font-english uppercase text-[#05121C] hover:text-[#5F94BD] transition-colors py-3 flex items-center gap-3"
                                        suppressHydrationWarning
                                    >
                                        {mounted ? item.label : ''}
                                        {mounted && (item.label === 'New Here?' || item.label === 'Ministries') && (
                                            <span className="text-xl">→</span>
                                        )}
                                    </Link>
                                </motion.div>
                            ))}

                            {/* Social Icons - Below Menu Items */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    opacity: { delay: 0.05 + menuItems.length * 0.2, duration: 0.1 },
                                    y: { delay: 0.0 + menuItems.length * 0.2, duration: 0.3, ease: "easeInOut" }
                                }}
                                className="flex gap-6 mt-8 pt-4"
                            >
                                <a href={sns.youtube || "#"} target="_blank" rel="noopener noreferrer" className="text-[#05121C] hover:text-[#5F94BD] transition-colors">
                                    <Youtube className="w-8 h-8" />
                                </a>
                                <a href={sns.instagram || "#"} target="_blank" rel="noopener noreferrer" className="text-[#05121C] hover:text-[#5F94BD] transition-colors">
                                    <Instagram className="w-8 h-8" />
                                </a>
                                <a href={sns.facebook || "#"} target="_blank" rel="noopener noreferrer" className="text-[#05121C] hover:text-[#5F94BD] transition-colors">
                                    <Facebook className="w-8 h-8" />
                                </a>
                            </motion.div>
                        </nav>

                        {/* Logo at bottom right - No opacity */}
                        <div className="absolute bottom-6 right-6 pb-[env(safe-area-inset-bottom)]">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.3 }}
                            >
                                <Image
                                    src="/assets/logo_v.png"
                                    alt="Gospel Church"
                                    width={96}
                                    height={48}
                                    className="w-24 h-auto"
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;
