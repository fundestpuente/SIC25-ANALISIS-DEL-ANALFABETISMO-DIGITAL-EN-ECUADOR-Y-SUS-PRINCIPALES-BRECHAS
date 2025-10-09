/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'navy': {
          'primary': '#1E3A8A',
          'secondary': '#1E40AF',
        },
        'accent': {
          'gold': '#D4AF37',
        },
        'gray': {
          'light': '#F3F4F6',
        }
      },
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
        'opensans': ['Open Sans', 'sans-serif'],
      },
      fontSize: {
        'title': '24px',
        'data': '16px',
      },
      borderRadius: {
        'elegant': '8px',
      },
      boxShadow: {
        'elegant': '4px 4px 8px rgba(0, 0, 0, 0.1)',
        'elevated': '6px 6px 12px rgba(0, 0, 0, 0.15)',
      },
      spacing: {
        'elegant': '16px',
        'padding': '12px',
      },
      backgroundImage: {
        'gradient-elegant': 'linear-gradient(135deg, #F3F4F6 0%, #FFFFFF 100%)',
        'gradient-navy': 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)',
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
      },
      transitionDuration: {
        'elegant': '300ms',
      }
    },
  },
  plugins: [],
};
