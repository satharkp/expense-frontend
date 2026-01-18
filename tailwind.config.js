/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // "Clean Fintech" Palette
        primary: {
          DEFAULT: '#0F172A', // Deep Navy / Slate 900
          foreground: '#F8FAFC', // Slate 50
          50: '#F5F7FA',
          100: '#E2E8F0',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        success: {
          DEFAULT: '#10B981', // Emerald 500
          foreground: '#FFFFFF',
          50: '#ECFDF5',
          100: '#D1FAE5',
        },
        danger: {
          DEFAULT: '#EF4444', // Red 500
          foreground: '#FFFFFF',
          50: '#FEF2F2',
          100: '#FEE2E2',
        },
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        }
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
};