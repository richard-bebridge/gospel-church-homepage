'use client';

import React, { useState, useEffect } from 'react';

const RightPanelMap = ({ x, y, title = "Location", isInline = false }) => {
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Endpoint: /api/naver/static-map?x=...&y=...
    const mapSrc = `/api/naver/static-map?x=${x}&y=${y}&w=720&h=360&level=16`;

    // External Link (Naver Map)
    // Attempting to use coordinates. 
    // If x/y are Web Mercator, map.naver.com usually supports them via 'x' and 'y' params or 'c' param.
    // We'll try the universal search fallback if strict coords fail, but based on request we use coords.
    // 'http://map.naver.com/?x=...&y=...' is the classic format.
    const naverMapLink = `http://map.naver.com/?x=${x}&y=${y}&title=${encodeURIComponent(title)}`;

    // Wayfinding link (Naver Map Route)
    // Usually requires start/end. Since we only have end (Goal), we open the map at that location.
    // Or we can use mobile deep link intent if on mobile, but this is a web component.
    // 'https://map.naver.com/v5/directions/-/-/${x},${y},${encodeURIComponent(title)}/-/transit?c=${x},${y},15,0,0'
    // It's safer to just provide a "View on Map" link that allows route finding from UI.
    // But user asked for "Directions" button.
    const directionLink = `https://map.naver.com/index.nhn?slng=&slat=&stext=&elng=${x}&elat=${y}&etext=${encodeURIComponent(title)}&menu=route`;

    return (
        <div className={`w-full flex flex-col items-center justify-center ${isInline ? 'py-8' : 'p-8 lg:p-16 h-full'}`}>
            <div className="relative w-full max-w-[80%] rounded-xl overflow-hidden shadow-2xl bg-gray-100 border border-[#2A4458]/10">
                {/* Skeleton Loader */}
                {isLoading && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                        <span className="text-gray-400 text-sm" suppressHydrationWarning>
                            {mounted ? 'Loading Map...' : ''}
                        </span>
                    </div>
                )}

                {/* Map Image */}
                {!hasError ? (
                    <img
                        src={mapSrc}
                        alt="Location Map"
                        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                        onLoad={() => setIsLoading(false)}
                        onError={() => {
                            setIsLoading(false);
                            setHasError(true);
                        }}
                    />
                ) : (
                    // Error State
                    <div className="absolute inset-0 bg-[#F4F3EF] flex flex-col items-center justify-center p-6 text-center">
                        <p className="text-[#2A4458] mb-4 font-bold" suppressHydrationWarning>
                            {mounted ? '지도를 불러오지 못했습니다.' : ''}
                        </p>
                        <a
                            href={naverMapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm underline text-gray-500 hover:text-[#2A4458]"
                            suppressHydrationWarning
                        >
                            {mounted ? '네이버 지도에서 보기' : ''}
                        </a>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
                <a
                    href={naverMapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-[#2A4458] text-white text-sm font-bold rounded hover:bg-[#1a2c3a] transition-colors shadow-lg"
                    suppressHydrationWarning
                >
                    {mounted ? '네이버 지도에서 보기' : ''}
                </a>
                <a
                    href={directionLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-white text-[#2A4458] border border-[#2A4458] text-sm font-bold rounded hover:bg-gray-50 transition-colors shadow-lg"
                    suppressHydrationWarning
                >
                    {mounted ? '길찾기' : ''}
                </a>
            </div>
        </div>
    );
};

export default RightPanelMap;
