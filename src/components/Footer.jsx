import React from 'react';
import { Instagram, Youtube, Facebook } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="w-full bg-[#05121C] text-white px-8 lg:px-24 py-24 snap-start">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-16 lg:gap-0">
                {/* Left Column: Info */}
                <div className="space-y-12">
                    <h3 className="font-bold text-xl font-korean text-white tracking-wide">대한예수교장로회 가스펠교회</h3>

                    <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-4 text-base font-mono text-gray-400">
                        <span className="font-bold text-[#5F94BD]">T.</span>
                        <span>02-583-2014</span>

                        <span className="font-bold text-[#5F94BD]">F.</span>
                        <span>02-6008-5830</span>

                        <span className="font-bold text-[#5F94BD]">E.</span>
                        <span>2014gospel@naver.com</span>

                        <span className="font-bold text-[#5F94BD]">A.</span>
                        <span>서울특별시 서초구 서초동 1627-5 B1</span>
                    </div>
                </div>

                {/* Right Column: Slogan & Social */}
                <div className="flex flex-col items-start lg:items-end gap-8">
                    <h2 className="font-sans font-bold text-4xl md:text-5xl leading-tight text-white uppercase tracking-widest text-left lg:text-right">
                        Seek.<br />
                        Stand.<br />
                        Transform.<br />
                        Radiate.
                    </h2>

                    <div className="flex gap-6">
                        <a href="#" className="text-[#5F94BD] hover:text-white transition-colors">
                            <Instagram className="w-6 h-6" />
                        </a>
                        <a href="#" className="text-[#5F94BD] hover:text-white transition-colors">
                            <Youtube className="w-6 h-6" />
                        </a>
                        <a href="#" className="text-[#5F94BD] hover:text-white transition-colors">
                            <Facebook className="w-6 h-6" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
