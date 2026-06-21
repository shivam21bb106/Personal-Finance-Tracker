import { Trash2 } from 'lucide-react'
import type { Transaction, TransactionType } from '../types/finance'
import { formatCurrency, formatDate } from '../utils/finance'

type TransactionsTableProps = {
  categories: string[]
  categoryFilter: string
  transactions: Transaction[]
  typeFilter: 'all' | TransactionType
  onCategoryFilterChange: (value: string) => void
  onDeleteTransaction: (id: string) => void
  onTypeFilterChange: (value: 'all' | TransactionType) => void
}

export function TransactionsTable({
  categories,
  categoryFilter,
  transactions,
  typeFilter,
  onCategoryFilterChange,
  onDeleteTransaction,
  onTypeFilterChange,
}: TransactionsTableProps) {
  return (
    <article
      className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-teal-300/15 dark:bg-zinc-950/80"
      id="transactions"
    >
      <div className="border-b border-slate-200 p-5 dark:border-teal-300/10">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-lg font-semibold dark:text-zinc-50">
              Transactions
            </h2>
            <p className="text-sm text-slate-500 dark:text-zinc-400">
              {transactions.length} matching records from search and filters
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              className="rounded-lg border border-emerald-900/10 bg-white/80 px-3 py-2 text-sm outline-none dark:border-teal-300/20 dark:bg-black/40 dark:text-zinc-100"
              onChange={(event) =>
                onTypeFilterChange(event.target.value as 'all' | TransactionType)
              }
              value={typeFilter}
            >
              <option value="all">All types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select
              className="rounded-lg border border-emerald-900/10 bg-white/80 px-3 py-2 text-sm outline-none dark:border-teal-300/20 dark:bg-black/40 dark:text-zinc-100"
              onChange={(event) => onCategoryFilterChange(event.target.value)}
              value={categoryFilter}
            >
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-black/40 dark:text-teal-100/70">
            <tr>
              <th className="px-5 py-3">Transaction</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3 text-right">Amount</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/10">
            {transactions.map((transaction) => (
              <tr
                className="transition hover:bg-slate-50 dark:hover:bg-teal-300/5"
                key={transaction.id}
              >
                <td className="px-5 py-4 font-medium text-slate-900 dark:text-zinc-100">
                  {transaction.title}
                </td>
                <td className="px-5 py-4 text-slate-500 dark:text-zinc-400">
                  {transaction.category}
                </td>
                <td className="px-5 py-4 text-slate-500 dark:text-zinc-400">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                      transaction.type === 'income'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200'
                        : 'bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-200'
                    }`}
                  >
                    {transaction.type}
                  </span>
                </td>
                <td
                  className={`px-5 py-4 text-right font-semibold ${
                    transaction.type === 'income'
                      ? 'text-emerald-600 dark:text-lime-200'
                      : 'text-slate-900 dark:text-zinc-100'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    aria-label={`Delete ${transaction.title}`}
                    className="inline-flex size-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-300"
                    onClick={() => onDeleteTransaction(transaction.id)}
                    type="button"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {transactions.length === 0 && (
        <div className="p-8 text-center">
          <p className="font-semibold">No transactions found</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
            Try another search or clear your filters.
          </p>
        </div>
      )}
    </article>
  )
}
