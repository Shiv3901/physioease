module.exports = {
  theme: {
    extend: {
      keyframes: {
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
      },
      animation: {
        blink: 'blink 1s steps(2, start) infinite',
      },
    },
  },
};
