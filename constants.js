import { useState } from 'react'
import { supabase, CLUB_EMAIL } from '../supabaseClient'

export default function Gate() {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  async function enter() {
    if (!pw) return
    setBusy(true); setErr('')
    const { error } = await supabase.auth.signInWithPassword({ email: CLUB_EMAIL, password: pw })
    setBusy(false)
    if (error) setErr('암호가 맞지 않아요. 다시 입력해 주세요.')
  }

  return (
    <div className="grid h-full place-items-center bg-ink px-6">
      <div className="w-full max-w-sm">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-marquee">members only</p>
        <h1 className="mt-3 text-3xl font-bold text-paper">영화모임</h1>
        <p className="mt-2 text-sm text-muted">모임 암호를 입력하면 들어갑니다.</p>

        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && enter()}
          placeholder="모임 암호"
          autoFocus
          className="mt-6 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-paper placeholder-muted outline-none focus:border-marquee"
        />
        {err && <p className="mt-2 text-sm text-minus">{err}</p>}

        <button
          onClick={enter}
          disabled={busy}
          className="mt-4 w-full rounded-xl bg-marquee py-3 font-semibold text-ink transition hover:brightness-105 disabled:opacity-50"
        >
          {busy ? '확인 중…' : '입장'}
        </button>
      </div>
    </div>
  )
}
