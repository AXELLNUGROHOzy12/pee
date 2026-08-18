/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0A0A0A',
          900: '#111111',
          800: '#1A1A1A',
          700: '#232323',
          600: '#2E2E2E',
          400: '#666666',
          300: '#8A8A8A',
          200: '#B5B5B5',
          100: '#EDEDED',
          50: '#FAFAFA',
        },
        bronze: '#B08D57',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        widest2: '0.28em',
      },
    },
  },
  plugins: [],
}
