/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                'text': 'var(--text)',
                'background': 'var(--background)',
                'background-extreme': 'var(--backgroundExtreme)',
                'primary': 'var(--primary)',
                'secondary': 'var(--secondary)',
                'accent': 'var(--accent)',
            },
        },
    },
    darkMode: "class",
    plugins: [
        require('@tailwindcss/typography')
    ],
}
