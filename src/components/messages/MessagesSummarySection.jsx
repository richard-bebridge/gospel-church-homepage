import React from 'react';
import Link from 'next/link';
import { CURRENT_TEXT } from '../../lib/typography-tokens';

const SummaryColumn = ({
    title,
    latestItem,
    olderItems,
    badgeComponent,
    basePath,
    renderTitleWithBadge,
    formatDate,
    bgColorClass,
    hideOlderItems = false,
    widthControlClass = "w-full max-w-[60%]",
    minHeightClass = "min-h-[calc(100vh-80px)]"
}) => (
    <div className={`w-full md:w-1/2 flex flex-col items-center justify-center ${minHeightClass} ${bgColorClass} relative`}>
        {/* Centered Content Block */}
        <div className={`${widthControlClass} flex flex-col pt-0 pb-0`}>
            {/* Title Label (Matches About Page 'Tag' Spacing) */}
            <div className="w-full flex flex-col items-center">
                <span className={CURRENT_TEXT.badge + " mb-6 block w-full text-left border-b border-[#2A4458]/10 pb-2"}>
                    {title}
                </span>
            </div>

            {/* List Content */}
            <div className="w-full flex flex-col">
                {latestItem ? (
                    <Link href={`${basePath}/${latestItem.id}`} className={`group block ${hideOlderItems ? 'mb-0' : 'mb-12'}`}>
                        <h2 className={`${CURRENT_TEXT.summary_title} mb-4 group-hover:text-[#2A4458] transition-colors line-clamp-3`}>
                            {renderTitleWithBadge(latestItem.title, badgeComponent)}
                        </h2>
                        {!hideOlderItems && (
                            <p className="text-lg text-[#2A4458] font-korean font-light line-clamp-2 leading-relaxed">
                                {latestItem.snippet}
                            </p>
                        )}
                    </Link>
                ) : (
                    <div className="mb-12 text-gray-400">No {title.toLowerCase().slice(0, -1)} available</div>
                )}

                {!hideOlderItems && (
                    <ul className="space-y-4">
                        {olderItems.map(item => (
                            <li key={item.id} className="border-b border-[#2A4458]/10 pb-2 last:border-0">
                                <Link href={`${basePath}/${item.id}`} className="flex justify-between items-baseline group">
                                    <span className="text-base text-[#05121C] font-korean font-light group-hover:text-[#2A4458] truncate mr-4">
                                        {item.title}
                                    </span>
                                    <span className="text-sm text-[#2A4458]/60 font-korean whitespace-nowrap">
                                        {formatDate(item.date)}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    </div>
);

const MessagesSummarySection = ({
    latestLetter,
    olderLetters = [],
    previousSermon,
    olderSermons = [],
    reversed = false,
    hideOlderItems = false,
    widthControlClass, // optional override
    minHeightClass = "min-h-[calc(100vh-80px)]"
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

    // Helper: Determine if date is within the last 7 days
    const isThisWeek = (dateString) => {
        if (!dateString) return false;
        const targetDate = new Date(dateString);
        const today = new Date();

        // Reset hours to compare just dates strictly
        targetDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const diffTime = today - targetDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Allow up to 7 days (e.g. from last Sunday to this Saturday)
        return diffDays >= 0 && diffDays < 7;
    };

    const badge = (
        <span className={CURRENT_TEXT.badge_pill + " ml-2 align-middle -mt-1"}>
            This Week
        </span>
    );

    return (
        <section className={`${minHeightClass} w-full flex flex-col md:flex-row relative z-30`}>
            {reversed ? (
                <>
                    {/* Sermons Column (Left in Reversed) */}
                    <SummaryColumn
                        title="Sermons"
                        latestItem={previousSermon}
                        olderItems={olderSermons}
                        // Only show badge if it IS the latest fetched item AND it is recent (< 7 days)
                        badgeComponent={(previousSermon?.isLatest && isThisWeek(previousSermon.date)) ? badge : null}
                        basePath="/sermons"
                        renderTitleWithBadge={renderTitleWithBadge}
                        formatDate={formatDate}
                        bgColorClass={!reversed ? 'bg-[#F4F3EF]' : ''}
                        hideOlderItems={hideOlderItems}
                        widthControlClass={widthControlClass}
                        minHeightClass={minHeightClass}
                    />
                    {/* Letters Column (Right in Reversed) */}
                    <SummaryColumn
                        title="Letters"
                        latestItem={latestLetter}
                        olderItems={olderLetters}
                        badgeComponent={(latestLetter?.isLatest && isThisWeek(latestLetter.date)) ? badge : null}
                        basePath="/letters"
                        renderTitleWithBadge={renderTitleWithBadge}
                        formatDate={formatDate}
                        bgColorClass={reversed ? 'bg-[#F4F3EF]' : ''}
                        hideOlderItems={hideOlderItems}
                        widthControlClass={widthControlClass}
                        minHeightClass={minHeightClass}
                    />
                </>
            ) : (
                <>
                    {/* Letters Column (Left in Normal) */}
                    <SummaryColumn
                        title="Letters"
                        latestItem={latestLetter}
                        olderItems={olderLetters}
                        badgeComponent={(latestLetter?.isLatest && isThisWeek(latestLetter.date)) ? badge : null}
                        basePath="/letters"
                        renderTitleWithBadge={renderTitleWithBadge}
                        formatDate={formatDate}
                        bgColorClass={reversed ? 'bg-[#F4F3EF]' : ''}
                        hideOlderItems={hideOlderItems}
                        widthControlClass={widthControlClass}
                        minHeightClass={minHeightClass}
                    />
                    {/* Sermons Column (Right in Normal) */}
                    <SummaryColumn
                        title="Sermons"
                        latestItem={previousSermon}
                        olderItems={olderSermons}
                        badgeComponent={(previousSermon?.isLatest && isThisWeek(previousSermon.date)) ? badge : null}
                        basePath="/sermons"
                        renderTitleWithBadge={renderTitleWithBadge}
                        formatDate={formatDate}
                        bgColorClass={!reversed ? 'bg-[#F4F3EF]' : ''}
                        hideOlderItems={hideOlderItems}
                        widthControlClass={widthControlClass}
                        minHeightClass={minHeightClass}
                    />
                </>
            )}
        </section>
    );
};

export default MessagesSummarySection;
