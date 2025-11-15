/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        'p-regular': ['Pretendard-Regular'],
        'p-semibold': ['Pretendard-SemiBold'],
        'p-extrabold': ['Pretendard-ExtraBold'],
        'p-black': ['Pretendard-Black'],
      },
      colors: {
        'background': '#fefefe',
        'white': '#fefefe',
        'black': '#191919',
        'primary':'#0763F6',
        'sky300': '#7DD3FC',
        'sky400': '#38BDF8',
        'sky500': '#1AB1FA',
        'sky600': '#0596DB',
        'sky700': '#0369A1',
        'blue-ribbon': {
          '50': '#eef0ff',
          '100': '#d3daff',
          '200': '#a9b8fe',
          '300': '#809afe',
          '400': '#527dfe',
          '500': '#0763f6',
          '600': '#0553d0',
          '700': '#033d9f',
          '800': '#012669',
          '900': '#000e33',
        }
      },
    },
  },
  plugins: [],
}; 
