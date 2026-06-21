import type { FormEvent } from 'react'
import { Plus } from 'lucide-react'
import type { TransactionForm, TransactionType } from '../types/finance'

type TransactionFormCardProps = {
  activeCategories: string[]
  form: TransactionForm
  onFormChange: (form: TransactionForm) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onTypeChange: (type: TransactionType) => void
}

export function TransactionFormCard({
  activeCategories,
  form,
  onFormChange,
  onSubmit,
  onTypeChange,
}: TransactionFormCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold dark:text-zinc-50">
            Add transaction
          </h2>
          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Saved instantly to localStorage
          </p>
        </div>
        <div className="grid size-10 place-items-center rounded-lg bg-teal-50 text-teal-800 dark:bg-teal-500/15 dark:text-teal-100">
          <Plus size={19} />
        </div>
      </div>

      <form className="mt-5 space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="text-sm font-medium text-slate-600 dark:text-zinc-300">
            Title
          </label>
          <input
            className="mt-2 w-full rounded-lg border border-emerald-900/10 bg-white/80 px-3 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 dark:border-teal-300/20 dark:bg-black/40 dark:text-zinc-100"
            onChange={(event) =>
              onFormChange({ ...form, title: event.target.value })
            }
            placeholder="e.g. Client invoice"
            value={form.title}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-zinc-300">
              Amount
            </label>
            <input
              className="mt-2 w-full rounded-lg border border-emerald-900/10 bg-white/80 px-3 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 dark:border-teal-300/20 dark:bg-black/40 dark:text-zinc-100"
              min="0"
              onChange={(event) =>
                onFormChange({ ...form, amount: event.target.value })
              }
              placeholder="0.00"
              step="0.01"
              type="number"
              value={form.amount}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-zinc-300">
              Date
            </label>
            <input
              className="mt-2 w-full rounded-lg border border-emerald-900/10 bg-white/80 px-3 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 dark:border-teal-300/20 dark:bg-black/40 dark:text-zinc-100"
              onChange={(event) =>
                onFormChange({ ...form, date: event.target.value })
              }
              type="date"
              value={form.date}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-zinc-300">
              Type
            </label>
            <div className="mt-2 grid grid-cols-2 rounded-lg border border-emerald-900/10 bg-emerald-50/60 p-1 dark:border-teal-300/20 dark:bg-black/40">
              {(['expense', 'income'] as TransactionType[]).map((type) => (
                <button
                  className={`rounded-md px-3 py-2 text-sm font-semibold capitalize transition ${
                    form.type === type
                      ? 'bg-white text-teal-800 shadow-sm dark:bg-teal-300/15 dark:text-teal-50'
                      : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
                  }`}
                  key={type}
                  onClick={() => onTypeChange(type)}
                  type="button"
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-zinc-300">
              Category
            </label>
            <select
              className="mt-2 w-full rounded-lg border border-emerald-900/10 bg-white/80 px-3 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 dark:border-teal-300/20 dark:bg-black/40 dark:text-zinc-100"
              onChange={(event) =>
                onFormChange({ ...form, category: event.target.value })
              }
              value={form.category}
            >
              {activeCategories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-teal-300 via-cyan-300 to-lime-300 px-4 py-3 text-sm font-bold text-zinc-950 shadow-lg shadow-teal-500/20 transition hover:-translate-y-0.5 hover:shadow-xl"
          type="submit"
        >
          <Plus size={17} />
          Add transaction
        </button>
      </form>
    </article>
  )
}
