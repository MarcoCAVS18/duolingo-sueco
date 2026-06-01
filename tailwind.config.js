/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        duo: {
          green: '#58cc02',
          greenDark: '#58a700',
          blue: '#1cb0f6',
          blueDark: '#1899d6',
          red: '#ff4b4b',
          redDark: '#ea2b2b',
          yellow: '#ffc800',
          purple: '#ce82ff',
          ink: '#3c3c3c',
          gray: '#777777',
          line: '#e5e5e5',
          bg: '#f7f7f7',
        },
      },
      fontFamily: {
        display: ['"Baloo 2"', 'system-ui', 'sans-serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        btn: '0 4px 0 0 rgba(0,0,0,0.12)',
        card: '0 2px 0 0 #e5e5e5, 0 0 0 2px #e5e5e5',
      },
    },
  },
  plugins: [],
}
