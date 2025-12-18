import '../styles/global.css';
import '../fonts.css';
import { getSiteSettings } from '../lib/site-settings';

export const metadata = {
    title: 'Gospel Church',
    description: 'In the Word, We Rise.',
};

export default async function RootLayout({ children }) {
    // We fetch settings here but don't render Header/Footer globally 
    // because existing pages (About/Visit/Messages) manage their own 
    // layout-specific Header/Footer positioning.

    return (
        <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
                <link rel="stylesheet" as="style" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
            </head>
            <body className="antialiased bg-[#F4F3EF]">
                {children}
            </body>
        </html>
    );
}
