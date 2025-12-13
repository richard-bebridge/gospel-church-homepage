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

    // Helper to render title with badge attached to the last word
    const renderTitleWithBadge = (title, badgeComponent) => {
        if (!title) return null;
        if (!badgeComponent) return title;

        const words = title.split(' ');
        if (words.length > 1) {
            const lastWord = words.pop();
            const mainText = words.join(' ');
            return (
                <>
                    {mainText}{' '}
                    <span className="whitespace-nowrap inline-block">
                        {lastWord}
                        {badgeComponent}
                    </span>
                </>
            );
        }
        return <span className="whitespace-nowrap inline-block">{title}{badgeComponent}</span>;
    };

    const badge = (
        <span className="inline-flex items-center rounded-full border-[2px] border-[#2A4458] bg-transparent px-1 py-0 pt-[3px] pb-[3px] text-[7px] font-bold font-sans text-[#2A4458] uppercase leading-none whitespace-nowrap shrink-0 ml-2 align-middle -mt-1">
            This Week
        </span>
    );

    return (
        <section className="min-h-[calc(100vh-80px)] w-full flex flex-col md:flex-row relative z-30">
            {/* LEFT COLUMN: GOSPEL LETTER (Transparent to show Sticky Title) */}
            <div className="w-full md:w-1/2 flex flex-col items-center pt-48 md:pt-80">
                <div className="w-full max-w-[60%] flex flex-col">
                    <span className="text-[#2A4458] font-sans font-bold text-xs tracking-widest uppercase mb-3 lg:mb-6 block pb-2">
                        Letters
                    </span>

                    {latestLetter ? (
                        <Link href={`/letters/${latestLetter.id}`} className="group block mb-12 lg:mb-20">
                            <h2 className="text-3xl md:text-3xl font-bold font-yisunshin text-[#05121C] mb-4 group-hover:text-[#2A4458] transition-colors line-clamp-3 leading-snug">
                                {renderTitleWithBadge(latestLetter.title, badge)}
                            </h2>
                            <p className="text-lg text-[#2A4458] font-yisunshin font-light line-clamp-2 leading-relaxed">
                                {latestLetter.snippet}
                            </p>
                        </Link>
                    ) : (
                        <div className="mb-12 lg:mb-20 text-gray-400">No letter available</div>
                    )}

                    <ul className="space-y-4">
                        {olderLetters.map(letter => (
                            <li key={letter.id} className="border-b border-[#2A4458]/10 pb-2 last:border-0">
                                <Link href={`/letters/${letter.id}`} className="flex justify-between items-baseline group">
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
            <div className="w-full md:w-1/2 flex flex-col items-center pt-48 md:pt-80 bg-[#F4F3EF]">
                <div className="w-full max-w-[60%] flex flex-col">
                    <span className="text-[#2A4458] font-sans font-bold text-xs tracking-widest uppercase mb-3 lg:mb-6 block pb-2">
                        Sermons
                    </span>

                    {previousSermon ? (
                        <Link href={`/sermons/${previousSermon.id}`} className="group block mb-12 lg:mb-20">
                            <h2 className="text-3xl md:text-3xl font-bold font-yisunshin text-[#05121C] mb-4 group-hover:text-[#2A4458] transition-colors line-clamp-3 leading-snug">
                                {renderTitleWithBadge(previousSermon.title, previousSermon.isLatest ? badge : null)}
                            </h2>
                            <p className="text-lg text-[#2A4458] font-yisunshin font-light line-clamp-2 leading-relaxed">
                                {previousSermon.snippet}
                            </p>
                        </Link>
                    ) : (
                        <div className="mb-12 lg:mb-20 text-gray-400">No sermon available</div>
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
