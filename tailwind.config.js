/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary90: '#FF2F00',
        primary80: '#F9370B',
        primary70: '#FF481F',
        primary60: '#FF552F',
        primary50: "#F25430",
        primary40: "#D1492A",
        primary30: "#94331E",
        primary20: "#702B1C",
        primary10: "#E98770",
        white: '#FFFFFF',
        neutral10: '#E5E5E5',
        neutral20: '#CCCCCC',
        neutral30: '#B2B2B2',
        neutral40: '#B2B2B2',
        neutral50: '#808080',
        neutral60: '#666666',
        neutral70: '#4C4C4C',
        neutral80: '#333333',
        neutral90: '#1A1A1A',
        black: '#000000',
        semanticSucess: '#27C237',
        semanticInfo: '#275BC2',
        semanticWarning: '#EB8509',
        semanticError: '#F64E34'
      },
      fontFamily: {
        'moonjelly': ['Moonjelly', 'serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
      screens: {
        'xl': '1240px',
      }
    },
  },
  plugins: [],
}
