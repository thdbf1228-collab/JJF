# 모임 앱

React + Vite + Tailwind · Supabase 백엔드 · Vercel 배포
모든 파일이 한 폴더(루트)에 평평하게 있습니다. GitHub 웹 업로드 시 폴더가 깨질 일이 없습니다.

## 셋업
1. Supabase 프로젝트 생성 → SQL Editor 에 `supabase-schema.sql` 붙여넣고 RUN.
2. Authentication > Users > Add user 로 **공유 계정 1개** 생성(이메일+비번).
   - Authentication > Providers > Email 에서 **"Confirm email" 끄기** (안 끄면 로그인 막힘).
3. Vercel 환경변수 3개 등록: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`(Settings>API), `VITE_CLUB_EMAIL`(2번 이메일).
4. `constants.js` — `APP_NAME`(앱 이름), `MEMBERS`(6명), `EDITOR`(기록자) 확인/수정.
5. 배포 후 입장 화면에서 2번 비번 입력.

## 환경변수 (Vercel > Settings > Environment Variables)
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_CLUB_EMAIL

## 계좌번호·회칙 수정
- Supabase `config` 테이블에서 직접 수정.

## 권한
- EDITOR(백성재)만 스케줄·사용내역 추가/수정/삭제. 나머지는 읽기 전용(실수 방지 수준).
- 운영회칙 동의는 6명 전원 가능.
