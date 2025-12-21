'use client';
import React, { useState, useEffect } from 'react';
import { Instagram, Youtube, Facebook } from 'lucide-react';
import { toTelHref } from '../lib/site-settings';

const Footer = ({ siteSettings }) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    // Fallback constants or use siteSettings
    const settings = siteSettings || {};
    const sns = settings.sns || {};

    return (
        <footer className="w-full bg-[#05121C] text-white px-6 sm:px-8 md:px-[10%] py-16 lg:py-20 snap-start">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-0">
                {/* Left Column: Info */}
                <div className="space-y-8">
                    <h3 className="font-medium text-xl font-korean text-white" suppressHydrationWarning>
                        {mounted ? (settings.church_name || '대한예수교장로회 가스펠교회').normalize('NFC') : ''}
                    </h3>

                    <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-base font-mono text-[#5F94BD]">
                        <span className="font-bold text-[#2A4458]">T.</span>
                        <a href={toTelHref(settings.phone_main)} className="font-light text-[#5F94BD] hover:text-white transition-colors" suppressHydrationWarning>
                            {mounted ? (settings.phone_main || '02-583-2014').normalize('NFC') : ''}
                        </a>

                        <span className="font-bold text-[#2A4458]">F.</span>
                        <span className="font-light text-[#5F94BD]" suppressHydrationWarning>
                            {mounted ? (settings.phone_alt || '02-6008-5830').normalize('NFC') : ''}
                        </span>

                        <span className="font-bold text-[#2A4458]">E.</span>
                        <a href={`mailto:${settings.email || '2014gospel@naver.com'}`} className="font-light text-[#5F94BD] hover:text-white transition-colors" suppressHydrationWarning>
                            {mounted ? (settings.email || '2014gospel@naver.com').normalize('NFC') : ''}
                        </a>

                        <span className="font-bold text-[#2A4458]">A.</span>
                        <span className="font-light text-[#5F94BD]" suppressHydrationWarning>
                            {mounted ? (settings.address || '서울특별시 서초구 서초동 1627-5 B1').normalize('NFC') : ''}
                        </span>
                    </div>
                </div>

                {/* Right Column: Slogan & Social */}
                <div className="flex flex-col items-start lg:items-end gap-6">
                    <h2 className="font-english font-bold text-3xl md:text-4xl lg:text-5xl leading-[1.1] text-white uppercase tracking-tight text-left lg:text-right">
                        Seek.<br />
                        Stand.<br />
                        Transform.<br />
                        Radiate.
                    </h2>

                    <div className="flex gap-4">
                        <a href={sns.instagram || "#"} target="_blank" rel="noopener noreferrer" className="text-[#5F94BD] hover:text-white transition-colors">
                            <Instagram className="w-6 h-6" />
                        </a>
                        <a href={sns.youtube || "#"} target="_blank" rel="noopener noreferrer" className="text-[#5F94BD] hover:text-white transition-colors">
                            <Youtube className="w-6 h-6" />
                        </a>
                        <a href={sns.facebook || "#"} target="_blank" rel="noopener noreferrer" className="text-[#5F94BD] hover:text-white transition-colors">
                            <Facebook className="w-6 h-6" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
