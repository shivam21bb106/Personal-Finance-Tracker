import { BriefcaseBusiness, Moon, Search, Sun } from 'lucide-react'
import type { Theme } from '../types/finance'

type DashboardHeaderProps = {
  search: string
  theme: Theme
  onSearchChange: (value: string) => void
  onToggleTheme: () => void
}

export function DashboardHeader({
  search,
  theme,
  onSearchChange,
  onToggleTheme,
}: DashboardHeaderProps) {
  return (
    <header className="hero-panel flex flex-col gap-6 p-5 sm:p-7 xl:flex-row xl:items-center xl:justify-between">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-800 dark:border-teal-400/20 dark:bg-teal-500/10 dark:text-teal-100">
          <BriefcaseBusiness size={15} />
          Personal finance command center
        </div>
        <h1 className="mt-5 max-w-xl font-['Space_Grotesk'] text-4xl font-bold leading-[0.95] tracking-tight text-slate-950 sm:text-6xl dark:text-zinc-50">
          MoneyMate dashboard
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base dark:text-zinc-400">
          Track freelance income, expenses, budget health, and spending patterns
          without a backend or paid APIs.
        </p>
      </div>

      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center xl:w-auto">
        <label className="glass-control flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-white/70 px-3 py-2.5 text-sm text-slate-500 sm:min-w-80 xl:w-80 dark:border-teal-300/20 dark:text-zinc-300">
          <Search size={17} />
          <input
            className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search transactions"
            type="search"
            value={search}
          />
        </label>
        <button
          aria-label="Toggle dark mode"
          className="glass-control inline-flex items-center justify-center gap-2 rounded-lg border border-white/70 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 dark:border-teal-300/20 dark:text-teal-50"
          onClick={onToggleTheme}
          type="button"
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
      </div>
    </header>
  )
}
