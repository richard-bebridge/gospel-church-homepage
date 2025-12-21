import LoadingSequence from '../../components/ui/LoadingSequence';
import Header from '../../components/Header';

export default function Loading() {
    // Header with empty settings during loading (showing default/fallback state)
    return (
        <>
            {/* Header z-320 > LoadingSequence z-300 */}
            <Header siteSettings={{}} />
            <LoadingSequence />
        </>
    );
}
