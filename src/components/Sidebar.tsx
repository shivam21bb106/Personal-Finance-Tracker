import {
  CreditCard,
  LayoutDashboard,
  LineChart,
  PiggyBank,
  Settings,
  Wallet,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const navItems: Array<{ label: string; icon: LucideIcon }> = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Transactions', icon: CreditCard },
  { label: 'Insights', icon: LineChart },
  { label: 'Budget', icon: PiggyBank },
  { label: 'Settings', icon: Settings },
]

export function Sidebar() {
  return (
    <aside className="sidebar-shell fixed inset-y-0 left-0 z-20 hidden h-screen w-72 flex-col overflow-y-auto border-r border-emerald-900/10 p-6 backdrop-blur lg:flex dark:border-teal-300/10">
      <div className="flex items-center gap-3">
        <div className="grid size-11 place-items-center rounded-lg bg-gradient-to-br from-teal-400 via-cyan-400 to-blue-500 text-zinc-950 shadow-lg shadow-teal-400/20">
          <Wallet size={22} />
        </div>
        <div>
          <p className="font-['Space_Grotesk'] text-lg font-bold tracking-tight">
            MoneyMate
          </p>
          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Freelancer finance
          </p>
        </div>
      </div>

      <nav className="mt-10 space-y-2">
        {navItems.map(({ label, icon: Icon }, index) => (
          <a
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
              index === 0
                ? 'bg-teal-50 text-teal-800 shadow-sm dark:bg-teal-300/15 dark:text-teal-50 dark:shadow-teal-950/30'
                : 'text-slate-600 hover:bg-teal-50/80 hover:text-teal-900 dark:text-zinc-400 dark:hover:bg-teal-300/10 dark:hover:text-teal-50'
            }`}
            href={`#${label.toLowerCase()}`}
            key={label}
          >
            <Icon size={18} />
            {label}
          </a>
        ))}
      </nav>

      <div className="mt-10 rounded-lg border border-emerald-900/10 bg-white/55 p-4 shadow-sm backdrop-blur dark:border-teal-300/15 dark:bg-teal-300/5">
        <p className="text-sm font-semibold dark:text-teal-50">
          Portfolio ready
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-zinc-400">
          Local-first finance dashboard with real interactions, charts, and
          persistent settings.
        </p>
      </div>

      <div className="mt-auto pt-4">
        <div className="rounded-lg border border-teal-300/10 bg-gradient-to-br from-teal-300/10 to-lime-300/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-200">
            Local storage
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-zinc-400">
            No backend. No database. Your transactions stay on this device.
          </p>
        </div>
      </div>
    </aside>
  )
}
