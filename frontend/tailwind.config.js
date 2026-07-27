/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'green-primary': '#22C55E',
        'pale-orange': '#FDBA74',
        'neon-lime': '#A3E635',
        'soft-cream': '#FFF7ED',
        'dark-text': '#1F2937',
        'bg-slate': '#F8FAFC',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-green': '0 0 20px -5px rgba(34, 197, 94, 0.4)',
        'glow-lime': '0 0 20px -5px rgba(163, 230, 53, 0.4)',
        'glow-orange': '0 0 20px -5px rgba(253, 186, 116, 0.4)',
      },
      animation: {
        'pulse-subtle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [],
}
