'use client';

import React from 'react';
import Image from 'next/image';

const LetterEndDivider = () => (
    <div className="w-full h-full flex flex-col items-center justify-center gap-12 opacity-60 text-[#2A4458]" aria-hidden="true">
        <div className="relative w-full max-w-[420px] flex items-center gap-6 px-6">
            <div className="h-px flex-1 bg-current" />
            <span className="text-sm tracking-[0.3em] font-mono font-bold uppercase">
                Finis
            </span>
            <div className="h-px flex-1 bg-current" />
        </div>

        <div className="relative w-5 h-5 grayscale contrast-75">
            <Image
                src="/assets/symbol.png"
                alt="End of Letter"
                fill
                sizes="32px"
                unoptimized
                className="object-contain"
            />
        </div>
    </div>
);

export default LetterEndDivider;
