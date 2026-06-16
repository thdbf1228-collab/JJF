// ── 앱 이름: 원하는 모임 이름으로 교체 ──
export const APP_NAME = '우리 모임'

// ── 고정 멤버 6명 ──
export const MEMBERS = ['백성재', '김주원', '강정민', '최태진', '이용우', '박주호']

// 기록 권한자: 이 사람만 스케줄/사용내역 추가·수정·삭제 가능 (나머지는 읽기 전용)
// ※ client-side 실수 방지용. 진짜 권한 잠금이 아님.
export const EDITOR = '백성재'

// 탭 정의
export const TABS = [
  { id: 'guide',    label: '가이드' },
  { id: 'rules',    label: '운영회칙' },
  { id: 'schedule', label: '스케줄' },
  { id: 'ledger',   label: '사용내역' },
]
