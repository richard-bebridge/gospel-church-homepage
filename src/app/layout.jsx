import '../styles/global.css';
import '../fonts.css';
import { getSiteSettings } from '../lib/site-settings';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-montserrat',
    weight: ['400', '500', '600', '700', '800', '900'],
    preload: true,
});

export const metadata = {
    title: 'Gospel Church',
    description: 'In the Word, We Rise.',
};

export default async function RootLayout({ children }) {
    // We fetch settings here but don't render Header/Footer globally 
    // because existing pages (About/Visit/Messages) manage their own 
    // layout-specific Header/Footer positioning.

    return (
        <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning className={`${montserrat.variable}`}>
            <head>
                {/* Preconnect for other assets if needed */}
                <link rel="stylesheet" as="style" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
            </head>
            <body className="antialiased bg-[#F4F3EF]">
                {children}
            </body>
        </html>
    );
}
