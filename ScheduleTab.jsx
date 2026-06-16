import { useEffect, useMemo, useState } from 'react'
import { supabase } from './supabaseClient'

const iso = (d) => d.toISOString().slice(0, 10)
const todayIso = () => iso(new Date())
const WD = ['일', '월', '화', '수', '목', '금', '토']

function dateLabel(s) {
  const d = new Date(s + 'T00:00:00')
  return `${s.slice(2).replace(/-/g, '.')} (${WD[d.getDay()]})`
}
function daysFrom(s) {
  const ms = new Date(s + 'T00:00:00') - new Date(todayIso() + 'T00:00:00')
  return Math.round(ms / 86400000)
}

export default function ScheduleTab({ me, isEditor }) {
  const today = new Date()
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selected, setSelected] = useState(todayIso())
  const [events, setEvents] = useState([])
  const [form, setForm] = useState({ title: '', memo: '', date: todayIso() })
  const [editId, setEditId] = useState(null)
  const [formOpen, setFormOpen] = useState(false)

  async function load() {
    const { data } = await supabase.from('schedules').select('*').order('date')
    setEvents(data || [])
  }
  useEffect(() => { load() }, [])

  const byDate = useMemo(() => {
    const m = {}
    events.forEach((e) => { (m[e.date] ||= []).push(e) })
    return m
  }, [events])

  const { upcoming, past } = useMemo(() => {
    const t = todayIso()
    const up = [], pa = []
    events.forEach((e) => (e.date >= t ? up : pa).push(e))
    up.sort((a, b) => a.date.localeCompare(b.date))
    pa.sort((a, b) => b.date.localeCompare(a.date))
    return { upcoming: up, past: pa.slice(0, 4) }
  }, [events])

  const grid = useMemo(() => {
    const y = cursor.getFullYear(), mo = cursor.getMonth()
    const first = new Date(y, mo, 1).getDay()
    const days = new Date(y, mo + 1, 0).getDate()
    const cells = []
    for (let i = 0; i < first; i++) cells.push(null)
    for (let d = 1; d <= days; d++) cells.push(iso(new Date(y, mo, d)))
    return cells
  }, [cursor])

  function openAdd() { setEditId(null); setForm({ title: '', memo: '', date: selected }); setFormOpen(true) }
  function openEdit(e) { setEditId(e.id); setForm({ title: e.title, memo: e.memo || '', date: e.date }); setFormOpen(true) }
  function closeForm() { setFormOpen(false); setEditId(null); setForm({ title: '', memo: '', date: selected }) }
  async function save() {
    if (!form.title.trim()) return
    if (editId) {
      await supabase.from('schedules').update({ title: form.title, memo: form.memo, date: form.date }).eq('id', editId)
    } else {
      await supabase.from('schedules').insert({ date: form.date, title: form.title, memo: form.memo, created_by: me })
    }
    closeForm(); load()
  }
  async function remove(id) {
    if (!confirm('이 일정을 삭제할까요?')) return
    await supabase.from('schedules').delete().eq('id', id); load()
  }

  const monthLabel = `${cursor.getFullYear()}.${String(cursor.getMonth() + 1).padStart(2, '0')}`

  const Row = ({ e, dim }) => {
    const n = daysFrom(e.date)
    const badge = n === 0 ? 'D-DAY' : `D-${n}`
    const left = n === 0 ? '오늘' : `${n}일 남음`
    return (
      <li className={`flex items-center justify-between gap-2 rounded-lg p-3 ${dim ? 'bg-paper' : 'bg-sky'}`}>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {!dim && <span className="shrink-0 rounded-md bg-brand px-1.5 py-0.5 text-[10px] font-bold text-white">{badge}</span>}
            <p className={`truncate text-sm font-medium ${dim ? 'text-muted' : 'text-ink'}`}>{e.title}</p>
          </div>
          <p className="mt-0.5 text-[11px] text-muted">{dateLabel(e.date)}{!dim ? ` · ${left}` : ''}{e.memo ? ` · ${e.memo}` : ''}</p>
        </div>
        {isEditor && (
          <div className="flex shrink-0 gap-2 text-xs">
            <button onClick={() => openEdit(e)} className="text-muted hover:text-ink">수정</button>
            <button onClick={() => remove(e.id)} className="text-minus">삭제</button>
          </div>
        )}
      </li>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-ink">스케줄</h2>
        {isEditor && (
          <button onClick={openAdd} className="rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white transition hover:brightness-105">
            + 일정 등록
          </button>
        )}
      </div>

      {isEditor && formOpen && (
        <section className="rounded-2xl border border-brand/40 bg-card p-4 shadow-soft">
          <p className="text-sm font-semibold text-ink">{editId ? '일정 수정' : '새 일정'}</p>
          <div className="mt-2 space-y-2">
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full rounded-lg border border-line px-3 py-2 text-sm text-ink outline-none focus:border-brand" />
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="제목 (예: 6월 정기모임)" className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand" />
            <input value={form.memo} onChange={(e) => setForm({ ...form, memo: e.target.value })} placeholder="메모 (장소·시간 등, 선택)" className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand" />
            <div className="flex gap-2">
              <button onClick={save} className="flex-1 rounded-lg bg-brand py-2 text-sm font-semibold text-white">{editId ? '수정 저장' : '추가'}</button>
              <button onClick={closeForm} className="rounded-lg border border-line px-3 text-sm text-muted">취소</button>
            </div>
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-line bg-card p-4 shadow-soft">
        <div className="flex items-center justify-between">
          <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} className="px-2 text-muted">‹</button>
          <span className="font-mono text-sm font-medium text-ink">{monthLabel}</span>
          <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} className="px-2 text-muted">›</button>
        </div>
        <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] text-muted">
          {WD.map((d) => <div key={d} className="py-1">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {grid.map((cell, i) => {
            if (!cell) return <div key={i} />
            const has = (byDate[cell] || []).length > 0
            const on = cell === selected
            const isToday = cell === todayIso()
            return (
              <button key={i} onClick={() => setSelected(cell)} className={`relative aspect-square rounded-lg text-sm transition ${on ? 'bg-brand text-white' : isToday ? 'bg-sky text-ink' : 'text-ink/80 hover:bg-sky'}`}>
                {Number(cell.slice(8))}
                {has && <span className={`absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${on ? 'bg-white' : 'bg-brand'}`} />}
              </button>
            )
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-card p-4 shadow-soft">
        <h3 className="text-sm font-semibold text-ink">다가오는 일정</h3>
        <ul className="mt-2 space-y-2">
          {upcoming.length === 0 && <li className="text-sm text-muted">등록된 일정이 없어요.</li>}
          {upcoming.map((e) => <Row key={e.id} e={e} />)}
        </ul>

        {past.length > 0 && (
          <>
            <h3 className="mt-4 border-t border-line pt-3 text-xs font-semibold text-muted">지난 일정</h3>
            <ul className="mt-2 space-y-2">
              {past.map((e) => <Row key={e.id} e={e} dim />)}
            </ul>
          </>
        )}
      </section>
    </div>
  )
}
