'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Youtube, AudioLines, Pause, Share2 } from 'lucide-react';

const FloatingMediaControls = ({ audioUrl, youtubeUrl, footerRef, fontScale, onToggleFontScale, shareTitle }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFooterVisible, setIsFooterVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const audioRef = useRef(null);

    // Toggle Audio Playback
    const toggleAudio = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    // Responsive Check (for animation variants)
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Footer Visibility Detection (Hide controls when footer appears)
    useEffect(() => {
        const footer = footerRef?.current;
        if (!footer) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsFooterVisible(entry.isIntersecting);
            },
            {
                root: null,
                threshold: 0.1 // 10% visibility triggers hide
            }
        );

        observer.observe(footer);
        return () => observer.disconnect();
    }, [footerRef]);

    // Share Handler
    const handleShare = async () => {
        const url = window.location.href;
        const title = shareTitle || document.title;
        const text = 'Gospel Church';

        if (navigator.share) {
            try {
                await navigator.share({ title, text, url });
            } catch (error) {

            }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                // Simple feedback for desktop (could be upgraded to a toast later)
                alert('URL이 복사되었습니다.');
            } catch (err) {
                console.error('Failed to copy content: ', err);
            }
        }
    };

    // Render Guard: Return null only if strictly NO controls are usable.
    // We assume if this component is rendered, we might want font controls.
    // If you want to hide it completely when no media, pass a prop or handle parent logic.
    // But for Gospel Letter, we want Font controls only.
    if (isFooterVisible) return null;

    // Animation Variants
    const controlsVariants = {
        hidden: {
            opacity: 0,
            scale: 0.8,
            x: isMobile ? 0 : 20,
            y: isMobile ? 20 : 0
        },
        visible: {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            x: isMobile ? 0 : 20,
            y: isMobile ? 20 : 0
        }
    };

    return (
        <>
            {audioUrl && <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col md:flex-row items-end md:items-center gap-2">
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={controlsVariants}
                            className="flex flex-col md:flex-row items-center gap-2"
                        >
                            {/* Font Size Toggle Button */}
                            <button
                                onClick={onToggleFontScale}
                                className="w-10 h-10 rounded-full bg-[#05121C] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform ring-2 ring-[#F4F3EF] font-bold font-serif"
                            >
                                {fontScale === 'normal' ? 'A+' : fontScale === 'large' ? 'A++' : 'A'}
                            </button>

                            {/* Audio Button */}
                            {audioUrl && (
                                <button
                                    onClick={toggleAudio}
                                    className="w-10 h-10 rounded-full bg-[#05121C] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform ring-2 ring-[#F4F3EF]"
                                >
                                    {isPlaying ? <Pause size={18} /> : <AudioLines size={18} />}
                                </button>
                            )}

                            {/* YouTube Button */}
                            {youtubeUrl && (
                                <button
                                    onClick={() => window.open(youtubeUrl, '_blank')}
                                    className="w-10 h-10 rounded-full bg-[#05121C] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform ring-2 ring-[#F4F3EF]"
                                >
                                    <Youtube size={18} />
                                </button>
                            )}

                            {/* Share Button */}
                            <button
                                onClick={handleShare}
                                className="w-10 h-10 rounded-full bg-[#05121C] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform ring-2 ring-[#F4F3EF]"
                            >
                                <Share2 size={18} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Toggle Button */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-10 h-10 rounded-full bg-[#05121C] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform ring-2 ring-[#F4F3EF]"
                >
                    <AnimatePresence mode="wait">
                        {isExpanded ? (
                            <motion.div
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                            >
                                <X size={20} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="open"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                            >
                                <Plus size={20} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>
            </div>
        </>
    );
};

export default FloatingMediaControls;
