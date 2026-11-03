/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        campus: {
          bg: '#0B1313',
          bgEnd: '#111C1A',
          card: '#162321',
          cardBorder: 'rgba(255, 255, 255, 0.08)',
          cardHover: '#1B2C29',
          accent: '#22C55E',
          accentHover: '#16A34A',
          accentLight: '#4ADE80',
          yellow: '#FACC15',
          yellowDark: '#EAB308',
          subtext: '#94A3B8',
          heading: '#F8FAFC',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-glow': '0 0 25px rgba(34, 197, 94, 0.15)',
        'yellow-glow': '0 0 25px rgba(250, 204, 21, 0.2)',
      }
    },
  },
  plugins: [],
}
