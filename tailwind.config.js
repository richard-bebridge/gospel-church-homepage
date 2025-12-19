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
                sans: ['var(--font-montserrat)', 'Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
                mono: ['Pretendard', 'Roboto Mono', 'monospace'], // User asked for code/small text to be Pretendard too
                korean: ['YiSunShin', 'sans-serif'],
                pretendard: ['Pretendard', 'sans-serif'],
                yisunshin: ['YiSunShin', 'sans-serif'],
            },
            animation: {
                'spin-slow': 'spin 20s linear infinite',
                'reverse-spin': 'spin 25s linear infinite reverse',
            }
        },
    },
    plugins: [],
}
