/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink:   '#1E293B',  // 진한 슬레이트(텍스트)
        paper: '#F4F9FF',  // 페이지 배경(연블루 화이트)
        card:  '#FFFFFF',
        line:  '#E3ECF7',  // 연블루 보더
        muted: '#64748B',
        brand: '#2E7BEE',  // 메인 블루
        sky:   '#E8F1FE',  // 연블루 면(칩/호버)
        plus:  '#16A34A',  // 입금
        minus: '#DC2626',  // 지출
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(30,41,59,.04), 0 8px 24px rgba(46,123,238,.06)',
      },
    },
  },
  plugins: [],
}
