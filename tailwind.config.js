// Akzidenz
// Univers

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: ['./components/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      // body: ['Univers', 'Helvetica', 'Arial', 'sans-serif'],
      body: ['Akzidenz', 'serif', 'Arial', 'sans-serif']
    },
    extend: {
      colors: {
        'accent': '#345740',
        'dark-filter': 'rgba(0,0,0,0.3)',
        'darker-filter': 'rgba(0,0,0,0.5)',
        'darkest-filter': 'rgba(0,0,0,0.9)',
      },
      screens: {
        '2xl': '1750px',
        '3xl': '2200px'
      }
    },
  },
  variants: {
    display: ['responsive', 'group-hover'],
  },
  plugins: [],
}
