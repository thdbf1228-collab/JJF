import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabaseClient'
import { EDITOR } from '../constants'

const won = (n) => n.toLocaleString('ko-KR')
const todayIso = () => new Date().toISOString().slice(0, 10)

export default function LedgerTab({ me, isEditor }) {
  const [rows, setRows] = useState([])
  const [form, setForm] = useState({ type: '지출', amount: '', memo: '', date: todayIso() })
  const [editId, setEditId] = useState(null)

  async function load() {
    const { data } = await supabase.from('transactions').select('*').order('date', { ascending: false }).order('created_at', { ascending: false })
    setRows(data || [])
  }
  useEffect(() => { load() }, [])

  const { balance, income, expense } = useMemo(() => {
    let income = 0, expense = 0
    rows.forEach((r) => { r.type === '입금' ? (income += r.amount) : (expense += r.amount) })
    return { balance: income - expense, income, expense }
  }, [rows])

  async function save() {
    const amt = parseInt(String(form.amount).replace(/[^0-9]/g, ''), 10)
    if (!amt || amt <= 0) return
    const payload = { type: form.type, amount: amt, memo: form.memo, date: form.date }
    if (editId) {
      await supabase.from('transactions').update(payload).eq('id', editId)
    } else {
      await supabase.from('transactions').insert({ ...payload, created_by: me })
    }
    setForm({ type: '지출', amount: '', memo: '', date: todayIso() }); setEditId(null); load()
  }
  async function remove(id) {
    if (!confirm('이 내역을 삭제할까요?')) return
    await supabase.from('transactions').delete().eq('id', id); load()
  }
  function startEdit(r) {
    setEditId(r.id)
    setForm({ type: r.type, amount: String(r.amount), memo: r.memo || '', date: r.date })
  }

  return (
    <div className="space-y-5">
      {/* 잔액 카드 */}
      <section className="rounded-2xl border border-line bg-ink p-5 text-paper shadow-soft">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-marquee">balance</p>
        <p className="mt-1 text-3xl font-bold tracking-tight">{won(balance)}<span className="ml-1 text-lg">원</span></p>
        <div className="mt-3 flex gap-4 text-xs text-white/60">
          <span>입금 {won(income)}</span>
          <span>지출 {won(expense)}</span>
        </div>
      </section>

      {/* 입력 폼 (기록자 전용) */}
      {isEditor && (
        <section className="rounded-2xl border border-line bg-card p-4 shadow-soft">
          <div className="flex gap-2">
            {['입금', '지출'].map((t) => (
              <button
                key={t}
                onClick={() => setForm({ ...form, type: t })}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                  form.type === t
                    ? t === '입금' ? 'bg-plus/10 text-plus' : 'bg-minus/10 text-minus'
                    : 'bg-paper text-muted'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="mt-2 space-y-2">
            <input
              inputMode="numeric"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="금액"
              className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-marquee"
            />
            <input
              value={form.memo}
              onChange={(e) => setForm({ ...form, memo: e.target.value })}
              placeholder="내용 (예: 6월 회비 / 팝콘값)"
              className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-marquee"
            />
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full rounded-lg border border-line px-3 py-2 text-sm text-ink outline-none focus:border-marquee"
            />
            <div className="flex gap-2">
              <button onClick={save} className="flex-1 rounded-lg bg-marquee py-2 text-sm font-semibold text-ink">
                {editId ? '수정 저장' : '내역 추가'}
              </button>
              {editId && (
                <button onClick={() => { setEditId(null); setForm({ type: '지출', amount: '', memo: '', date: todayIso() }) }} className="rounded-lg border border-line px-3 text-sm text-muted">
                  취소
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 내역 리스트 */}
      <section className="rounded-2xl border border-line bg-card p-4 shadow-soft">
        <h2 className="text-sm font-semibold text-ink">전체 내역</h2>
        <ul className="mt-2 divide-y divide-line">
          {rows.length === 0 && <li className="py-3 text-sm text-muted">아직 내역이 없어요.</li>}
          {rows.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-2 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm text-ink">{r.memo || (r.type === '입금' ? '입금' : '지출')}</p>
                <p className="text-[11px] text-muted">{r.date} · {r.created_by}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className={`text-sm font-medium ${r.type === '입금' ? 'text-plus' : 'text-minus'}`}>
                  {r.type === '입금' ? '+' : '−'}{won(r.amount)}
                </span>
                {isEditor && (
                  <div className="flex flex-col text-[11px] leading-tight">
                    <button onClick={() => startEdit(r)} className="text-muted hover:text-ink">수정</button>
                    <button onClick={() => remove(r.id)} className="text-minus">삭제</button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
        {!isEditor && (
          <p className="mt-2 border-t border-line pt-3 text-xs text-muted">내역 기록은 {EDITOR} 님이 합니다.</p>
        )}
      </section>
    </div>
  )
}
