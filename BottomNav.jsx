export default function BottomNav({ tabs, active, onChange }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 mx-auto max-w-md border-t border-line bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <div className="grid grid-cols-4">
        {tabs.map((t) => {
          const on = t.id === active
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={`relative py-3 text-sm transition ${on ? 'text-brand font-semibold' : 'text-muted'}`}
            >
              {on && <span className="absolute inset-x-5 top-0 h-0.5 rounded-full bg-brand" />}
              {t.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
