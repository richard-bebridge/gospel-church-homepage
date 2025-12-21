/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                korean: ['YiSunShin', 'sans-serif'], // Titles / Display
                english: ['var(--font-montserrat)', 'sans-serif'], // Nav / Hero
                mono: ['Pretendard', 'sans-serif'], // Body / Content (User requested 'mono' for this slot)
            },
            animation: {
                'spin-slow': 'spin 20s linear infinite',
                'reverse-spin': 'spin 25s linear infinite reverse',
            }
        },
    },
    plugins: [],
}
