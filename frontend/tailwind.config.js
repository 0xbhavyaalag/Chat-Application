module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0b1020',
          soft: '#10182f',
        },
        accent: {
          DEFAULT: '#38bdf8',
          strong: '#0ea5e9',
        },
      },
      boxShadow: {
        glow: '0 0 40px rgba(56, 189, 248, 0.18)',
      },
    },
  },
  plugins: [],
};
