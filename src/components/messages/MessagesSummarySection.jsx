import React from 'react';
import Link from 'next/link';

const MessagesSummarySection = ({
    latestLetter,
    olderLetters = [],
    previousSermon,
    olderSermons = []
}) => {
    // Helper to format date "YYYY.MM.DD"
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    };

    return (
        <section className="min-h-screen w-full flex flex-col md:flex-row relative z-30">
            {/* LEFT COLUMN: GOSPEL LETTER (Transparent to show Sticky Title) */}
            <div className="w-full md:w-1/2 flex flex-col items-center pt-48 md:pt-96">
                <div className="w-full max-w-[60%] flex flex-col">
                    <span className="text-[#2A4458] font-sans font-bold text-xs tracking-widest uppercase mb-6 block pb-2">
                        This Week's Letter
                    </span>

                    {latestLetter ? (
                        <Link href={`/test2/${latestLetter.id}`} className="group block mb-12">
                            <h2 className="text-3xl md:text-3xl font-bold font-yisunshin text-[#05121C] mb-4 group-hover:text-[#2A4458] transition-colors">
                                {latestLetter.title}
                            </h2>
                            <p className="text-lg text-[#05121C] font-yisunshin font-light line-clamp-1 leading-relaxed">
                                {latestLetter.snippet}
                            </p>
                        </Link>
                    ) : (
                        <div className="mb-12 text-gray-400">No letter available</div>
                    )}

                    <ul className="space-y-4">
                        {olderLetters.map(letter => (
                            <li key={letter.id} className="border-b border-[#2A4458]/10 pb-2 last:border-0">
                                <Link href={`/test2/${letter.id}`} className="flex justify-between items-baseline group">
                                    <span className="text-base text-[#05121C] font-yisunshin font-light group-hover:text-[#2A4458] truncate mr-4">
                                        {letter.title}
                                    </span>
                                    <span className="text-sm text-[#2A4458]/60 font-yisunshin whitespace-nowrap">
                                        {formatDate(letter.date)}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* RIGHT COLUMN: SERMON (Solid Background to cover verses) */}
            <div className="w-full md:w-1/2 flex flex-col items-center pt-48 md:pt-96 bg-[#F4F3EF]">
                <div className="w-full max-w-[60%] flex flex-col">
                    <span className="text-[#2A4458] font-sans font-bold text-xs tracking-widest uppercase mb-6 block pb-2">
                        Previous Sermon
                    </span>

                    {previousSermon ? (
                        <Link href={`/sermons/${previousSermon.id}`} className="group block mb-12">
                            <h2 className="text-3xl md:text-3xl font-bold font-yisunshin text-[#05121C] mb-4 group-hover:text-[#2A4458] transition-colors">
                                {previousSermon.title}
                            </h2>
                            <p className="text-lg text-[#05121C] font-yisunshin font-light line-clamp-1 leading-relaxed">
                                {previousSermon.snippet}
                            </p>
                        </Link>
                    ) : (
                        <div className="mb-12 text-gray-400">No previous sermon available</div>
                    )}

                    <ul className="space-y-4">
                        {olderSermons.map(sermon => (
                            <li key={sermon.id} className="border-b border-[#2A4458]/10 pb-2 last:border-0">
                                <Link href={`/sermons/${sermon.id}`} className="flex justify-between items-baseline group">
                                    <span className="text-base text-[#05121C] font-yisunshin font-light group-hover:text-[#2A4458] truncate mr-4">
                                        {sermon.title}
                                    </span>
                                    <span className="text-sm text-[#2A4458]/60 font-yisunshin whitespace-nowrap">
                                        {formatDate(sermon.date)}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default MessagesSummarySection;
