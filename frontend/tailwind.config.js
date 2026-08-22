export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dusk: '#0B1220',
        duskdeep: '#060A12',
        stone: '#EDE7DD',
        amber: '#D9A441',
        teal: '#2C6E63',
        clay: '#B4532A',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
