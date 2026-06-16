import { useState } from 'react'
import { supabase, CLUB_EMAIL } from './supabaseClient'
import { APP_NAME } from './constants'

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
    <div className="grid h-full place-items-center bg-paper px-6">
      <div className="w-full max-w-sm">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-brand">members only</p>
        <h1 className="mt-3 text-3xl font-bold text-ink">{APP_NAME}</h1>
        <p className="mt-2 text-sm text-muted">모임 암호를 입력하면 들어갑니다.</p>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && enter()}
          placeholder="모임 암호"
          autoFocus
          className="mt-6 w-full rounded-xl border border-line bg-card px-4 py-3 text-ink placeholder-muted shadow-soft outline-none focus:border-brand"
        />
        {err && <p className="mt-2 text-sm text-minus">{err}</p>}
        <button
          onClick={enter}
          disabled={busy}
          className="mt-4 w-full rounded-xl bg-brand py-3 font-semibold text-white transition hover:brightness-105 disabled:opacity-50"
        >
          {busy ? '확인 중…' : '입장'}
        </button>
      </div>
    </div>
  )
}
