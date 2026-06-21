import { formatCurrency } from '../utils/finance'

type BudgetTrackerProps = {
  averageTransaction: number
  budgetProgress: number
  budgetRemaining: number
  currentMonthExpense: number
  monthlyBudget: number
  transactionCount: number
  onBudgetChange: (value: number) => void
}

const getBudgetStatus = (budgetProgress: number) => {
  if (budgetProgress > 90) {
    return 'Tight'
  }

  if (budgetProgress > 70) {
    return 'Watch'
  }

  return 'Healthy'
}

const getBudgetProgressClass = (budgetProgress: number) => {
  if (budgetProgress > 90) {
    return 'bg-red-500'
  }

  if (budgetProgress > 70) {
    return 'bg-orange-500'
  }

  return 'bg-teal-300'
}

export function BudgetTracker({
  averageTransaction,
  budgetProgress,
  budgetRemaining,
  currentMonthExpense,
  monthlyBudget,
  transactionCount,
  onBudgetChange,
}: BudgetTrackerProps) {
  return (
    <article
      className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900"
      id="budget"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold dark:text-zinc-50">
            Monthly budget
          </h2>
          <p className="text-sm text-slate-500 dark:text-zinc-400">
            {formatCurrency(currentMonthExpense)} of{' '}
            {formatCurrency(monthlyBudget)} used this month
          </p>
        </div>
        <label className="flex items-center gap-2 rounded-lg border border-emerald-900/10 bg-emerald-50/60 px-3 py-2 text-sm font-medium text-slate-700 dark:border-teal-300/20 dark:bg-black/40 dark:text-zinc-300">
          Budget
          <input
            className="w-24 bg-transparent text-right font-semibold text-slate-950 outline-none dark:text-white"
            min="0"
            onChange={(event) => onBudgetChange(Number(event.target.value))}
            step="100"
            type="number"
            value={monthlyBudget}
          />
        </label>
      </div>

      <div className="mt-8 grid gap-5 2xl:grid-cols-[1fr_0.72fr]">
        <div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-600 dark:text-zinc-300">
              Budget progress
            </span>
            <span className="font-semibold">{budgetProgress}%</span>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className={`h-full rounded-full transition-all ${getBudgetProgressClass(
                budgetProgress,
              )}`}
              style={{ width: `${budgetProgress}%` }}
            />
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-emerald-50/60 p-4 dark:bg-black/35">
              <p className="text-sm text-slate-500 dark:text-zinc-400">
                Remaining
              </p>
              <p className="mt-1 text-lg font-semibold">
                {formatCurrency(budgetRemaining)}
              </p>
            </div>
            <div className="rounded-lg bg-emerald-50/60 p-4 dark:bg-black/35">
              <p className="text-sm text-slate-500 dark:text-zinc-400">
                Avg. transaction
              </p>
              <p className="mt-1 text-lg font-semibold">
                {formatCurrency(averageTransaction)}
              </p>
            </div>
            <div className="rounded-lg bg-emerald-50/60 p-4 dark:bg-black/35">
              <p className="text-sm text-slate-500 dark:text-zinc-400">
                Status
              </p>
              <p className="mt-1 text-lg font-semibold">
                {getBudgetStatus(budgetProgress)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-emerald-900/10 bg-emerald-50/60 p-4 dark:border-teal-300/15 dark:bg-black/35">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold dark:text-teal-50">
              Monthly pulse
            </p>
            <span className="rounded-full bg-teal-100 px-2 py-1 text-xs font-bold text-teal-800 dark:bg-teal-300/15 dark:text-teal-100">
              {budgetProgress}%
            </span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-300 to-lime-300"
              style={{ width: `${budgetProgress}%` }}
            />
          </div>
          <div className="mt-5 grid gap-4 text-sm sm:grid-cols-[1fr_1.25fr] sm:items-end 2xl:grid-cols-1">
            <div>
              <p className="text-slate-500 dark:text-zinc-400">
                Spent this month
              </p>
              <p className="mt-1 text-xl font-semibold dark:text-zinc-100">
                {formatCurrency(currentMonthExpense)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-white/55 p-3 dark:bg-white/[0.04]">
                <p className="text-slate-500 dark:text-zinc-400">
                  Remaining
                </p>
                <p className="mt-1 font-semibold text-teal-700 dark:text-teal-100">
                  {formatCurrency(budgetRemaining)}
                </p>
              </div>
              <div className="rounded-lg bg-white/55 p-3 dark:bg-white/[0.04]">
                <p className="text-slate-500 dark:text-zinc-400">Records</p>
                <p className="mt-1 font-semibold dark:text-zinc-100">
                  {transactionCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
