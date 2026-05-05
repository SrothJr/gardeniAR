/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#071024',
        surface: '#0f172a',
        primary: {
          DEFAULT: '#22c55e',
          foreground: '#051013',
        },
        secondary: {
          DEFAULT: '#3b82f6',
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#f59e0b',
          foreground: '#ffffff',
        },
        destructive: {
          DEFAULT: '#f43f5e',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#1e293b',
          foreground: '#9fb1be',
        },
        foreground: '#e6eef3',
        border: 'rgba(148,163,184,0.14)',
      },
    },
  },
  plugins: [],
}
