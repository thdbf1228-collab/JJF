# 영화모임 앱 (6인 모임 관리)

React + Vite + Tailwind · Supabase 백엔드 · Vercel 배포

## 탭
- **가이드** — 모임통장 가입방법 + 자동이체 계좌(복사 버튼)
- **운영회칙** — 회칙 표시 + 멤버별 "확인했어요" 체크 동의
- **스케줄** — 월 달력 + 일정 등록/수정/삭제
- **사용내역** — 입금/지출 입력, 잔액 자동계산(합산, 저장 안 함)

## 보안 구조
- 개인 로그인 없음. **모임 공유 계정 1개**로 입장 → Supabase Auth 비번이 곧 "모임 암호".
- RLS = `authenticated`만 전체 권한. 즉 로그인 안 하면 데이터 0건 노출.
- 멤버 6명은 고정(코드 상수). "나는 누구"는 인증이 아니라 표기용(localStorage).
- ⚠️ 비번이 새면 그게 곧 열쇠 복사. 단톡방에 평문으로 돌리지 말 것.

## 셋업 (5단계)

1. **Supabase 프로젝트 생성** → SQL Editor 에 `supabase-schema.sql` 붙여넣고 RUN.
2. **공유 계정 생성**: Authentication > Users > Add user
   - 이메일: 예) `movieclub@yourdomain.com` (실제 받을 필요 없음)
   - 비밀번호: 모임 암호로 쓸 값
   - ⚙️ Authentication > Providers > Email 에서 **"Confirm email" 끄기** (안 끄면 미인증으로 로그인 막힘)
3. **환경변수**: `.env.example` 복사 → `.env`
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (Settings > API)
   - `VITE_CLUB_EMAIL` = 2번에서 만든 이메일
4. **멤버 이름**: `src/constants.js` 의 `MEMBERS` 를 실제 6명으로 교체.
5. **로컬 확인**: `npm install && npm run dev`

## Vercel 배포
- GitHub repo는 **반드시 Private**.
- Vercel에서 import → Environment Variables 에 위 3개 등록 → Deploy.

## 계좌번호·회칙 수정
- `config` 테이블에서 직접 수정(Supabase Table Editor) 하거나 SQL로 update.
- 모임 이미지: `public/club.png` 추가 후 GuideTab의 플레이스홀더를 `<img>`로 교체.
