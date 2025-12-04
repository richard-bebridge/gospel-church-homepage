/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Montserrat', 'Inter', 'sans-serif'],
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
