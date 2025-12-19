import React from 'react';
import Link from 'next/link';

const SummaryColumn = ({
    title,
    latestItem,
    olderItems,
    badgeComponent,
    basePath,
    renderTitleWithBadge,
    formatDate,
    bgColorClass
}) => (
    <div className={`w-full md:w-1/2 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] ${bgColorClass} relative`}>
        {/* Centered Content Block */}
        <div className="w-full max-w-[60%] flex flex-col pt-0 pb-0">
            {/* Title Label (Matches About Page 'Tag' Spacing) */}
            <div className="w-full flex flex-col items-center">
                <span className="text-[#2A4458] font-sans font-bold text-xs tracking-widest uppercase mb-6 block w-full text-left border-b border-[#2A4458]/10 pb-2">
                    {title}
                </span>
            </div>

            {/* List Content */}
            <div className="w-full flex flex-col">
                {latestItem ? (
                    <Link href={`${basePath}/${latestItem.id}`} className="group block mb-12">
                        <h2 className="text-3xl md:text-3xl font-bold font-yisunshin text-[#05121C] mb-4 group-hover:text-[#2A4458] transition-colors line-clamp-3 leading-snug">
                            {renderTitleWithBadge(latestItem.title, badgeComponent)}
                        </h2>
                        <p className="text-lg text-[#2A4458] font-yisunshin font-light line-clamp-2 leading-relaxed">
                            {latestItem.snippet}
                        </p>
                    </Link>
                ) : (
                    <div className="mb-12 text-gray-400">No {title.toLowerCase().slice(0, -1)} available</div>
                )}

                <ul className="space-y-4">
                    {olderItems.map(item => (
                        <li key={item.id} className="border-b border-[#2A4458]/10 pb-2 last:border-0">
                            <Link href={`${basePath}/${item.id}`} className="flex justify-between items-baseline group">
                                <span className="text-base text-[#05121C] font-yisunshin font-light group-hover:text-[#2A4458] truncate mr-4">
                                    {item.title}
                                </span>
                                <span className="text-sm text-[#2A4458]/60 font-yisunshin whitespace-nowrap">
                                    {formatDate(item.date)}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
);

const MessagesSummarySection = ({
    latestLetter,
    olderLetters = [],
    previousSermon,
    olderSermons = [],
    reversed = false
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
            {reversed ? (
                <>
                    {/* Sermons Column (Left in Reversed) */}
                    <SummaryColumn
                        title="Sermons"
                        latestItem={previousSermon}
                        olderItems={olderSermons}
                        badgeComponent={previousSermon?.isLatest ? badge : null}
                        basePath="/sermons"
                        renderTitleWithBadge={renderTitleWithBadge}
                        formatDate={formatDate}
                        bgColorClass={!reversed ? 'bg-[#F4F3EF]' : ''}
                    />
                    {/* Letters Column (Right in Reversed) */}
                    <SummaryColumn
                        title="Letters"
                        latestItem={latestLetter}
                        olderItems={olderLetters}
                        badgeComponent={latestLetter?.isLatest ? badge : null}
                        basePath="/letters"
                        renderTitleWithBadge={renderTitleWithBadge}
                        formatDate={formatDate}
                        bgColorClass={reversed ? 'bg-[#F4F3EF]' : ''}
                    />
                </>
            ) : (
                <>
                    {/* Letters Column (Left in Normal) */}
                    <SummaryColumn
                        title="Letters"
                        latestItem={latestLetter}
                        olderItems={olderLetters}
                        badgeComponent={latestLetter?.isLatest ? badge : null}
                        basePath="/letters"
                        renderTitleWithBadge={renderTitleWithBadge}
                        formatDate={formatDate}
                        bgColorClass={reversed ? 'bg-[#F4F3EF]' : ''}
                    />
                    {/* Sermons Column (Right in Normal) */}
                    <SummaryColumn
                        title="Sermons"
                        latestItem={previousSermon}
                        olderItems={olderSermons}
                        badgeComponent={previousSermon?.isLatest ? badge : null}
                        basePath="/sermons"
                        renderTitleWithBadge={renderTitleWithBadge}
                        formatDate={formatDate}
                        bgColorClass={!reversed ? 'bg-[#F4F3EF]' : ''}
                    />
                </>
            )}
        </section>
    );
};

export default MessagesSummarySection;
