/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    safelist: [
        // Font scaling toggle classes (dynamically constructed with !important)
        '!text-[24px]',
        '!text-[28px]',
        '!leading-relaxed',
        // AutoScaleTitle classes (with !important to override clamp)
        '!text-[56px]',
        '!text-[48px]',
        '!text-[40px]',
        '!text-[32px]'
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
