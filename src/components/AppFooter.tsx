import { Wallet } from 'lucide-react'

type AppFooterProps = {
  onClearAllData: () => void
  onLoadDemoData: () => void
}

export function AppFooter({ onClearAllData, onLoadDemoData }: AppFooterProps) {
  return (
    <footer className="footer-grid mt-8 rounded-lg border border-slate-200 p-5 text-sm text-slate-500 sm:p-6 dark:border-teal-300/15 dark:text-zinc-400">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-gradient-to-br from-teal-300 to-lime-300 text-zinc-950">
              <Wallet size={20} />
            </div>
            <div>
              <p className="font-['Space_Grotesk'] text-lg font-bold text-slate-900 dark:text-zinc-50">
                MoneyMate
              </p>
              <p className="text-xs uppercase tracking-[0.22em] text-teal-700 dark:text-teal-200">
                Local-first finance OS
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-xl leading-6">
            A dark, responsive portfolio dashboard for tracking freelance cash
            flow, expenses, budgets, and spending patterns. All data stays in
            your browser with localStorage.
          </p>
        </div>

        <div>
          <p className="font-semibold text-slate-900 dark:text-zinc-50">
            Sections
          </p>
          <div className="mt-3 grid gap-2">
            {['Dashboard', 'Transactions', 'Insights', 'Budget'].map((item) => (
              <a
                className="transition hover:text-teal-700 dark:hover:text-teal-200"
                href={`#${item.toLowerCase()}`}
                key={item}
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="font-semibold text-slate-900 dark:text-zinc-50">
            Project
          </p>
          <div className="mt-3 grid gap-2">
            <span>React + Vite</span>
            <span>Tailwind CSS</span>
            <span>Recharts</span>
            <span>No backend</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-teal-300/10">
        <p>(c) 2026 MoneyMate. Built for a clean freelancer portfolio.</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-red-300/40 bg-red-500/10 px-3 py-2 font-semibold text-red-700 transition hover:-translate-y-0.5 hover:bg-red-500/15 dark:border-red-300/20 dark:text-red-200"
            onClick={onClearAllData}
            type="button"
          >
            Clear all data
          </button>
          <button
            className="glass-control inline-flex w-fit items-center gap-2 rounded-lg border border-white/70 px-3 py-2 font-semibold text-slate-700 transition hover:-translate-y-0.5 dark:border-teal-300/15 dark:text-teal-50"
            onClick={onLoadDemoData}
            type="button"
          >
            Load demo data
          </button>
        </div>
      </div>
    </footer>
  )
}
