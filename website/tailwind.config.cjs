/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./**/*.{html,js}"
        // "./src/**/*.{js,ts,jsx,tsx,html}",
    ],
    darkMode: "class",
    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: '1rem',
                lg: '2rem',
            },
        },
    },
    plugins: [],
}
