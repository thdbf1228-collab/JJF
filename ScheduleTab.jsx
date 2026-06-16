import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { TABS, MEMBERS, EDITOR } from './constants'
import Gate from './components/Gate'
import BottomNav from './components/BottomNav'
import GuideTab from './tabs/GuideTab'
import RulesTab from './tabs/RulesTab'
import ScheduleTab from './tabs/ScheduleTab'
import LedgerTab from './tabs/LedgerTab'

export default function App() {
  const [session, setSession] = useState(undefined) // undefined=확인중
  const [tab, setTab] = useState('guide')
  const [me, setMe] = useState(() => localStorage.getItem('me') || '')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  function pickMe(name) {
    setMe(name)
    localStorage.setItem('me', name)
  }

  if (session === undefined) {
    return <div className="grid h-full place-items-center bg-ink text-muted">불러오는 중…</div>
  }
  if (!session) return <Gate />

  // 로그인 후 본인 선택(인증 아님, 표기용)
  if (!me) {
    return (
      <div className="grid h-full place-items-center bg-ink px-6">
        <div className="w-full max-w-sm text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-marquee">who are you</p>
          <h1 className="mt-2 text-2xl font-bold text-paper">나는 누구?</h1>
          <p className="mt-1 text-sm text-muted">입력·동의에 이름으로 남습니다</p>
          <div className="mt-6 grid grid-cols-2 gap-2">
            {MEMBERS.map((m) => (
              <button
                key={m}
                onClick={() => pickMe(m)}
                className="rounded-xl border border-white/10 bg-white/5 py-3 text-paper transition hover:border-marquee hover:bg-white/10"
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const isEditor = me === EDITOR

  return (
    <div className="mx-auto flex h-full max-w-md flex-col bg-paper">
      <Header me={me} isEditor={isEditor} onSwitch={() => pickMe('')} />
      <main className="flex-1 overflow-y-auto px-4 pb-28 pt-4">
        {tab === 'guide' && <GuideTab />}
        {tab === 'rules' && <RulesTab me={me} />}
        {tab === 'schedule' && <ScheduleTab me={me} isEditor={isEditor} />}
        {tab === 'ledger' && <LedgerTab me={me} isEditor={isEditor} />}
      </main>
      <BottomNav tabs={TABS} active={tab} onChange={setTab} />
    </div>
  )
}

function Header({ me, isEditor, onSwitch }) {
  return (
    <header className="flex items-center justify-between border-b border-line bg-paper/80 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-marquee">movie club</span>
        {!isEditor && (
          <span className="rounded-full bg-paper px-2 py-0.5 text-[10px] text-muted ring-1 ring-line">읽기 전용</span>
        )}
      </div>
      <button onClick={onSwitch} className="text-xs text-muted underline-offset-2 hover:underline">
        {me} 님 · 변경
      </button>
    </header>
  )
}
