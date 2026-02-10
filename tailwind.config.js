/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        accent: '#FF0000',
        'accent-dark': '#CC0000',
        'accent-light': '#FF3333',
        surface: '#111111',
        'surface-light': '#1A1A1A',
        'surface-lighter': '#222222',
        'text-primary': '#FFFFFF',
        'text-secondary': '#AAAAAA',
        'text-muted': '#666666',
        'border-dark': '#333333',
        'border-accent': '#FF0000',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
}