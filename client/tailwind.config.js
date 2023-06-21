/** @type {import('tailwindcss').Config} */

import themes from './src/assets/theme'
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      ...themes,
    ],
  },
}

