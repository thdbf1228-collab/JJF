import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

export default function GuideTab() {
  const [cfg, setCfg] = useState({})
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    supabase.from('config').select('key,value').then(({ data }) => {
      const map = {}
      ;(data || []).forEach((r) => (map[r.key] = r.value))
      setCfg(map)
    })
  }, [])

  function copyAccount() {
    navigator.clipboard?.writeText(cfg.account_number || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-line bg-card p-4 shadow-soft">
        <h2 className="text-sm font-semibold text-ink">모임통장 가입방법</h2>
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted">{cfg.join_guide || '—'}</p>
      </section>

      <section className="rounded-2xl border border-line bg-card p-4 shadow-soft">
        <h2 className="text-sm font-semibold text-ink">자동이체 계좌</h2>
        <div className="mt-2 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-muted">{cfg.account_bank} · {cfg.account_holder}</p>
            <p className="font-mono text-lg font-medium tracking-tight text-ink">{cfg.account_number || '—'}</p>
          </div>
          <button onClick={copyAccount} className="shrink-0 rounded-lg border border-line px-3 py-2 text-xs font-medium text-brand transition hover:bg-sky">
            {copied ? '복사됨' : '계좌 복사'}
          </button>
        </div>
      </section>
    </div>
  )
}
