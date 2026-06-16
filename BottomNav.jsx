/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1A1714',
        paper: '#FBF8F2',
        card: '#FFFFFF',
        line: '#EAE3D7',
        muted: '#8C8377',
        marquee: '#E0A82E',   // amber accent (cinema marquee)
        plus: '#2E7D5B',      // 입금
        minus: '#C2492E',     // 지출
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(26,23,20,.04), 0 8px 24px rgba(26,23,20,.06)',
      },
    },
  },
  plugins: [],
}
