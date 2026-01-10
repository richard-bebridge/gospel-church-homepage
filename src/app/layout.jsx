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
    metadataBase: new URL('https://gospelchurch.kr'),
    title: 'Gospel Church',
    description: 'In the Word, We Rise.',
    verification: {
        other: {
            'naver-site-verification': '44bd46cd821fca036828efe2ac28d60d89922744',
        },
    },
};

export default async function RootLayout({ children }) {
    // We fetch settings here but don't render Header/Footer globally 
    // because existing pages (About/Visit/Messages) manage their own 
    // layout-specific Header/Footer positioning.

    return (
        <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning className={`${montserrat.variable}`}>
            <head>
                {/* Google Tag Manager */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TR4RCJLQ');`,
                    }}
                />
                {/* End Google Tag Manager */}
                {/* Preconnect for other assets if needed */}
                <link rel="stylesheet" as="style" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
            </head>
            <body className="antialiased bg-[#F4F3EF]">
                {/* Google Tag Manager (noscript) */}
                <noscript>
                    <iframe
                        src="https://www.googletagmanager.com/ns.html?id=GTM-TR4RCJLQ"
                        height="0"
                        width="0"
                        style={{ display: 'none', visibility: 'hidden' }}
                    />
                </noscript>
                {/* End Google Tag Manager (noscript) */}
                {children}
            </body>
        </html>
    );
}
