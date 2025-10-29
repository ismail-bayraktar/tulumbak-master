/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF7F0',
          100: '#FFECE0',
          200: '#FFD9BF',
          300: '#FFBF99',
          400: '#FFA366',
          500: '#FF8235',
          600: '#FF6B35',
          700: '#E55A2B',
          800: '#CC4A20',
          900: '#A63A1A',
        },
        text: {
          primary: '#1F2937',
          secondary: '#6B7280',
          muted: '#9CA3AF',
        },
        success: '#10B981',
        info: '#3B82F6',
        warning: '#F59E0B',
        error: '#EF4444',
        background: '#FAFAFA',
        border: '#E5E7EB',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'nunito': ['Nunito Sans', 'sans-serif'],
      },
      fontSize: {
        'heading-primary': ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'heading-secondary': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
      },
      boxShadow: {
        'modern': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'modern-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}