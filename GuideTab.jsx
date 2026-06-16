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
      <div className="overflow-hidden rounded-2xl shadow-soft">
        <svg viewBox="0 0 380 200" className="block w-full" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="인생은 40부터">
          <rect x="0" y="0" width="380" height="200" rx="16" fill="#E8F1FE" />
          <path d="M165 92 l2.5 5 5 2.5 -5 2.5 -2.5 5 -2.5 -5 -5 -2.5 5 -2.5 z" fill="#9DBFF0" />
          <path d="M150 128 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2 z" fill="#BCD3F2" />
          <text x="28" y="84" fontFamily="Pretendard, system-ui, sans-serif" fontSize="30" fontWeight="700" fill="#1E293B">인생은</text>
          <text x="28" y="128" fontFamily="Pretendard, system-ui, sans-serif" fontSize="42" fontWeight="800" fill="#2E7BEE">40부터</text>
          <text x="29" y="154" fontFamily="Pretendard, system-ui, sans-serif" fontSize="12" fill="#64748B">초등학교 친구 여섯, 이제 마흔</text>
          <path d="M350 136 h15 v36 a4 4 0 0 1 -4 4 h-7 a4 4 0 0 1 -4 -4 z" fill="#3DA35D" />
          <rect x="354.5" y="121" width="6" height="16" fill="#3DA35D" />
          <rect x="353.5" y="116" width="8" height="6" rx="1" fill="#2E7D45" />
          <rect x="350" y="150" width="15" height="13" fill="#FFFFFF" opacity="0.92" />
          <path d="M317 130 L336 86" stroke="#2E7BEE" strokeWidth="12" strokeLinecap="round" />
          <path d="M283 132 L274 156" stroke="#2E7BEE" strokeWidth="12" strokeLinecap="round" />
          <rect x="278" y="116" width="44" height="48" rx="16" fill="#2E7BEE" />
          <circle cx="273" cy="158" r="6" fill="#F1C9A1" />
          <circle cx="337" cy="82" r="6.5" fill="#F1C9A1" />
          <path d="M329 58 L345 58 L342 80 L332 80 Z" fill="#FFFFFF" stroke="#AFC6E6" strokeWidth="1.5" />
          <path d="M332.5 70 L341.5 70 L342 79 L332 79 Z" fill="#CFE0F7" />
          <circle cx="300" cy="90" r="28" fill="#F1C9A1" />
          <path d="M272 90 a28 28 0 0 1 56 0 z" fill="#33373F" />
          <circle cx="283" cy="101" r="5" fill="#F4A6A6" opacity="0.6" />
          <circle cx="317" cy="101" r="5" fill="#F4A6A6" opacity="0.6" />
          <path d="M286 91 q5 -6 10 0" stroke="#33373F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M304 91 q5 -6 10 0" stroke="#33373F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M291 103 q9 9 18 0" stroke="#33373F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
      </div>

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
