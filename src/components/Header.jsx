import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Youtube, Instagram, Facebook } from 'lucide-react';
import logo from '../assets/logo.png';
import logoV from '../assets/logo_v.png';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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

    const menuItems = [
        { label: 'Home', href: '/' },
        { label: 'Bulletin', href: '/bulletin' },
        { label: 'BulletinDB', href: '/bulletindb' },
        { label: 'Print', href: '/print' },
        { label: 'Test', href: '/test' },
        { label: 'About', href: '#' },
        { label: 'Sermons', href: '#' },
        { label: 'Visit', href: '#' },
    ];

    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <>
            <header className="fixed top-0 left-0 w-full h-16 md:h-20 px-6 sm:px-8 lg:px-24 flex justify-between items-center bg-[#05121C] z-[110]">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <img src={logo} alt="Gospel Church Logo" className="h-8 md:h-10 w-auto brightness-0 invert" />
                    {/* <span className="hidden sm:block text-white font-sans font-bold text-sm md:text-base tracking-wider uppercase">Gospel Church</span> */}
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                    {menuItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="text-sm font-bold tracking-wide hover:text-[#5F94BD] transition-colors uppercase text-white"
                        >
                            {item.label}
                        </a>
                    ))}
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
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-[#F4F3EF] z-[120] md:hidden overflow-y-auto"
                    >
                        {/* Header with Logo and Close Button */}
                        <div className="flex justify-between items-center px-6 py-4 pt-[calc(1rem+env(safe-area-inset-top))]">
                            {/* Logo */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1, duration: 0.3 }}
                                className="flex items-center gap-3"
                            >
                                <img src={logo} alt="Gospel Church Logo" className="h-10 w-auto" />
                            </motion.div>

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
                        <nav className="flex flex-col px-6 py-2 min-h-[calc(100vh-6rem)]">
                            {menuItems.map((item, index) => (
                                <motion.a
                                    key={item.label}
                                    href={item.href}
                                    onClick={handleLinkClick}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        opacity: { delay: 0.05 + index * 0.65, duration: 0.1 },
                                        y: { delay: 0.15 + index * 0.65, duration: 0.5, ease: "easeOut" }
                                    }}
                                    className="text-2xl font-bold text-[#05121C] hover:text-[#5F94BD] transition-colors py-3 flex items-center gap-3"
                                >
                                    {item.label}
                                    {(item.label === 'New Here?' || item.label === 'Ministries') && (
                                        <span className="text-xl">→</span>
                                    )}
                                </motion.a>
                            ))}

                            {/* Social Icons - Below Menu Items */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    opacity: { delay: 0.05 + menuItems.length * 0.65, duration: 0.1 },
                                    y: { delay: 0.15 + menuItems.length * 0.65, duration: 0.5, ease: "easeOut" }
                                }}
                                className="flex gap-6 mt-8 pt-4"
                            >
                                <a href="#" className="text-[#05121C] hover:text-[#5F94BD] transition-colors">
                                    <Youtube className="w-8 h-8" />
                                </a>
                                <a href="#" className="text-[#05121C] hover:text-[#5F94BD] transition-colors">
                                    <Instagram className="w-8 h-8" />
                                </a>
                                <a href="#" className="text-[#05121C] hover:text-[#5F94BD] transition-colors">
                                    <Facebook className="w-8 h-8" />
                                </a>
                            </motion.div>
                        </nav>

                        {/* Logo at bottom right - No opacity */}
                        <div className="absolute bottom-6 right-6 pb-[env(safe-area-inset-bottom)]">
                            <motion.img
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.3 }}
                                src={logoV}
                                alt="Gospel Church"
                                className="w-24 h-auto"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;
