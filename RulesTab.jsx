import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { MEMBERS } from './constants'

export default function RulesTab({ me }) {
  const [rules, setRules] = useState('')
  const [consent, setConsent] = useState({})

  async function load() {
    const [{ data: cfg }, { data: rows }] = await Promise.all([
      supabase.from('config').select('value').eq('key', 'rules_text').single(),
      supabase.from('rules_consent').select('*'),
    ])
    setRules(cfg?.value || '')
    const map = {}
    ;(rows || []).forEach((r) => (map[r.member] = r))
    setConsent(map)
  }
  useEffect(() => { load() }, [])

  async function toggleMine() {
    const next = !(consent[me]?.agreed)
    await supabase.from('rules_consent').upsert({
      member: me, agreed: next, agreed_at: next ? new Date().toISOString() : null,
    })
    load()
  }

  const agreedCount = MEMBERS.filter((m) => consent[m]?.agreed).length

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-line bg-card p-4 shadow-soft">
        <h2 className="text-sm font-semibold text-ink">운영회칙</h2>
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink/80">{rules || '—'}</p>
      </section>

      <section className="rounded-2xl border border-line bg-card p-4 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink">동의 현황</h2>
          <span className="font-mono text-xs text-muted">{agreedCount}/{MEMBERS.length}</span>
        </div>
        <ul className="mt-3 divide-y divide-line">
          {MEMBERS.map((m) => {
            const c = consent[m]
            const isMe = m === me
            return (
              <li key={m} className="flex items-center justify-between py-2.5">
                <span className={`text-sm ${isMe ? 'font-semibold text-ink' : 'text-ink/80'}`}>{m}{isMe && ' (나)'}</span>
                {isMe ? (
                  <button
                    onClick={toggleMine}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${c?.agreed ? 'bg-plus/10 text-plus' : 'bg-brand text-white'}`}
                  >
                    {c?.agreed ? '동의함 · 취소' : '확인했어요'}
                  </button>
                ) : (
                  <span className={`text-xs ${c?.agreed ? 'text-plus' : 'text-muted'}`}>{c?.agreed ? '동의' : '대기'}</span>
                )}
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
