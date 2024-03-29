import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'pale-butter': '#FBFBF1',
                'eggplant-purple': '#37344B',
                'air-force-blue': '#3688D4',
                'warm-grey': '#AAADA3',
                'neutral-light-grey': '#E4E5E1'
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            keyframes: {
                wiggle: {
                    '0%, 100%': { transform: 'none' },
                    '50%': { transform: 'translateY(-5px)' },
                }
            },
            animation: {
                wiggle: 'wiggle 1s ease-in-out infinite'
                    },
        },
    },
    plugins: [],
}
export default config
