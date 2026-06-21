import {
  ArrowDownRight,
  ArrowUpRight,
  PiggyBank,
  Wallet,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { SummaryTotals } from '../types/finance'
import { formatCurrency } from '../utils/finance'

type SummaryCardsProps = {
  totals: SummaryTotals
  transactionCount: number
}

type StatCardProps = {
  label: string
  value: string
  helper: string
  icon: LucideIcon
  tone: 'blue' | 'green' | 'orange' | 'teal'
}

function StatCard({ label, value, helper, icon: Icon, tone }: StatCardProps) {
  const toneClasses = {
    blue: 'bg-teal-50 text-teal-800 ring-teal-100 dark:bg-teal-300/12 dark:text-teal-100 dark:ring-teal-300/25',
    green:
      'bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-lime-300/12 dark:text-lime-100 dark:ring-lime-300/25',
    orange:
      'bg-orange-50 text-orange-700 ring-orange-100 dark:bg-orange-400/12 dark:text-orange-200 dark:ring-orange-300/20',
    teal: 'bg-cyan-50 text-cyan-700 ring-cyan-100 dark:bg-cyan-300/12 dark:text-cyan-100 dark:ring-cyan-300/25',
  }

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-teal-300/15 dark:bg-zinc-950/80">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-zinc-400">
          {label}
        </p>
        <div
          className={`grid size-10 place-items-center rounded-lg ring-1 ${toneClasses[tone]}`}
        >
          <Icon size={19} />
        </div>
      </div>
      <p className="mt-5 font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-slate-950 dark:text-zinc-50">
        {value}
      </p>
      <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
        {helper}
      </p>
    </article>
  )
}

export function SummaryCards({ totals, transactionCount }: SummaryCardsProps) {
  const expenseShare =
    totals.income > 0 ? Math.round((totals.expenses / totals.income) * 100) : 0

  return (
    <section
      className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      id="dashboard"
    >
      <StatCard
        helper={`${transactionCount} saved transactions`}
        icon={Wallet}
        label="Total balance"
        tone="blue"
        value={formatCurrency(totals.balance)}
      />
      <StatCard
        helper="All recorded earnings"
        icon={ArrowUpRight}
        label="Income"
        tone="green"
        value={formatCurrency(totals.income)}
      />
      <StatCard
        helper={`${expenseShare}% of income`}
        icon={ArrowDownRight}
        label="Expenses"
        tone="orange"
        value={formatCurrency(totals.expenses)}
      />
      <StatCard
        helper={`${totals.savingsRate}% savings rate`}
        icon={PiggyBank}
        label="Savings"
        tone="teal"
        value={formatCurrency(totals.savings)}
      />
    </section>
  )
}
