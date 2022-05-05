const defaultTheme = require('tailwindcss/defaultTheme')
const windmill = require('@learn49/aura-ui/config')

module.exports = windmill({
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans]
      },
      boxShadow: {
        bottom:
          '0 5px 6px -7px rgba(0, 0, 0, 0.6), 0 2px 4px -5px rgba(0, 0, 0, 0.06)'
      },
      backgroundImage: {
        404: 'url(/404/bg.png)',
        initial: 'url(/login.png)'
      }
    }
  },
  plugins: [require('@tailwindcss/aspect-ratio')]
})
