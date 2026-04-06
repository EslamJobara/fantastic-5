/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Primary - Tech Blue
        "primary": "#0058be",
        "on-primary": "#ffffff",
        "primary-container": "#2170e4",
        "on-primary-container": "#fefcff",
        "primary-fixed": "#d8e2ff",
        "on-primary-fixed": "#001a42",
        "primary-fixed-dim": "#adc6ff",
        "on-primary-fixed-variant": "#004395",
        
        // Secondary
        "secondary": "#495e8a",
        "on-secondary": "#ffffff",
        "secondary-container": "#b6ccff",
        "on-secondary-container": "#405682",
        "secondary-fixed": "#d8e2ff",
        "on-secondary-fixed": "#001a42",
        "secondary-fixed-dim": "#b1c6f9",
        "on-secondary-fixed-variant": "#304671",
        
        // Tertiary - Warm Accent
        "tertiary": "#924700",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#b75b00",
        "on-tertiary-container": "#fffbff",
        "tertiary-fixed": "#ffdcc6",
        "on-tertiary-fixed": "#311400",
        "tertiary-fixed-dim": "#ffb786",
        "on-tertiary-fixed-variant": "#723600",
        
        // Error
        "error": "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
        
        // Surface Tiers - Critical for Tonal Layering
        "surface": "#f8f9fa",
        "on-surface": "#191c1d",
        "surface-dim": "#d9dadb",
        "surface-bright": "#f8f9fa",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f3f4f5",
        "surface-container": "#edeeef",
        "surface-container-high": "#e7e8e9",
        "surface-container-highest": "#e1e3e4",
        "surface-variant": "#e1e3e4",
        "on-surface-variant": "#424754",
        "surface-tint": "#005ac2",
        
        // Inverse
        "inverse-surface": "#2e3132",
        "inverse-on-surface": "#f0f1f2",
        "inverse-primary": "#adc6ff",
        
        // Outline - Ghost Borders
        "outline": "#727785",
        "outline-variant": "#c2c6d6",
        
        // Background
        "background": "#f8f9fa",
        "on-background": "#191c1d",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
        full: "9999px"
      },
      fontFamily: {
        headline: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['2.75rem', { lineHeight: '1.1', letterSpacing: '-0.015em', fontWeight: '700' }],
        'display-sm': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'title-lg': ['1.75rem', { lineHeight: '1.3', fontWeight: '500' }],
        'title-md': ['1.25rem', { lineHeight: '1.4', fontWeight: '500' }],
        'title-sm': ['1rem', { lineHeight: '1.5', fontWeight: '500' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body-md': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6' }],
        'label-lg': ['0.875rem', { lineHeight: '1.4', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase' }],
        'label-md': ['0.75rem', { lineHeight: '1.4', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase' }],
        'label-sm': ['0.625rem', { lineHeight: '1.4', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase' }],
      },
      boxShadow: {
        'ambient': '0 40px 40px -5px rgba(25, 28, 29, 0.06)',
        'ambient-lg': '0 60px 60px -10px rgba(25, 28, 29, 0.08)',
        'primary': '0 8px 16px rgba(0, 88, 190, 0.2)',
        'primary-lg': '0 12px 24px rgba(0, 88, 190, 0.3)',
      },
      backdropBlur: {
        'glass': '20px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'blob': 'blob 7s infinite ease-in-out',
      },
      keyframes: {
        blob: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        }
      }
    }
  },
  plugins: [],
}
