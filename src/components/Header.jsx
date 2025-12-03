import React from 'react';
import logo from '../assets/logo.png';

const Header = () => {
    return (
        <header className="fixed top-0 left-0 w-full h-24 px-8 md:px-12 flex justify-between items-center bg-[#05121C] z-[100]">
            <div className="w-48">
                <img src={logo} alt="Gospel Church Logo" className="w-full h-auto brightness-0 invert" />
            </div>
            <nav className="hidden md:flex gap-12 text-xs font-bold uppercase tracking-widest text-white font-sans">
                <nav className="hidden md:flex items-center gap-8">
                    <a href="/" className="text-sm font-bold tracking-widest hover:text-[#5F94BD] transition-colors uppercase">Home</a>
                    <a href="/bulletin" className="text-sm font-bold tracking-widest hover:text-[#5F94BD] transition-colors uppercase">Bulletin</a>
                    <a href="/bulletindb" className="text-sm font-bold tracking-widest hover:text-[#5F94BD] transition-colors uppercase">BulletinDB</a>
                    <a href="/print" className="text-sm font-bold tracking-widest hover:text-[#5F94BD] transition-colors uppercase">Print</a>
                    <a href="/test" className="text-sm font-bold tracking-widest hover:text-[#5F94BD] transition-colors uppercase">Test</a>
                    <a href="#" className="text-sm font-bold tracking-widest hover:text-[#5F94BD] transition-colors uppercase">About</a>
                    <a href="#" className="text-sm font-bold tracking-widest hover:text-[#5F94BD] transition-colors uppercase">Sermons</a>
                    <a href="#" className="text-sm font-bold tracking-widest hover:text-[#5F94BD] transition-colors uppercase">Visit</a>
                </nav>
            </nav>
        </header>
    );
};

export default Header;
