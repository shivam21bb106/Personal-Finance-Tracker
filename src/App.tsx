import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  LineChart as LineChartIcon,
  Moon,
  PiggyBank,
  Plus,
  Search,
  Settings,
  Sun,
  Trash2,
  Wallet,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type TransactionType = 'income' | 'expense'
type Theme = 'light' | 'dark'

type Transaction = {
  id: string
  title: string
  amount: number
  type: TransactionType
  category: string
  date: string
}

type TransactionForm = {
  title: string
  amount: string
  type: TransactionType
  category: string
  date: string
}

type Settings = {
  theme: Theme
  monthlyBudget: number
  designVersion: string
}

const STORAGE_KEYS = {
  transactions: 'moneymate.transactions',
  settings: 'moneymate.settings',
}

const DESIGN_VERSION = 'dark-gen-2'

const incomeCategories = [
  'Client Work',
  'Consulting',
  'Retainer',
  'Product Sales',
  'Investments',
  'Other Income',
]

const expenseCategories = [
  'Workspace',
  'Software',
  'Travel',
  'Utilities',
  'Marketing',
  'Food',
  'Taxes',
  'Subscriptions',
  'Other',
]

const categoryColors = [
  '#2dd4bf',
  '#a3e635',
  '#38bdf8',
  '#f97316',
  '#f43f5e',
  '#22c55e',
  '#eab308',
  '#06b6d4',
  '#94a3b8',
]

const sampleTransactions: Transaction[] = [
  {
    id: 'demo-1',
    title: 'Brand identity project',
    amount: 4200,
    type: 'income',
    category: 'Client Work',
    date: '2026-06-18',
  },
  {
    id: 'demo-2',
    title: 'Monthly client retainer',
    amount: 3600,
    type: 'income',
    category: 'Retainer',
    date: '2026-06-05',
  },
  {
    id: 'demo-3',
    title: 'Design software suite',
    amount: 84,
    type: 'expense',
    category: 'Software',
    date: '2026-06-16',
  },
  {
    id: 'demo-4',
    title: 'Coworking studio pass',
    amount: 280,
    type: 'expense',
    category: 'Workspace',
    date: '2026-06-12',
  },
  {
    id: 'demo-5',
    title: 'Campaign ad testing',
    amount: 460,
    type: 'expense',
    category: 'Marketing',
    date: '2026-06-09',
  },
  {
    id: 'demo-6',
    title: 'Client discovery workshop',
    amount: 1850,
    type: 'income',
    category: 'Consulting',
    date: '2026-05-22',
  },
  {
    id: 'demo-7',
    title: 'Conference travel',
    amount: 720,
    type: 'expense',
    category: 'Travel',
    date: '2026-05-18',
  },
  {
    id: 'demo-8',
    title: 'Cloud storage and tools',
    amount: 145,
    type: 'expense',
    category: 'Subscriptions',
    date: '2026-05-10',
  },
  {
    id: 'demo-9',
    title: 'Landing page build',
    amount: 2900,
    type: 'income',
    category: 'Client Work',
    date: '2026-04-21',
  },
  {
    id: 'demo-10',
    title: 'Quarterly tax payment',
    amount: 980,
    type: 'expense',
    category: 'Taxes',
    date: '2026-04-15',
  },
  {
    id: 'demo-11',
    title: 'SaaS template sales',
    amount: 1280,
    type: 'income',
    category: 'Product Sales',
    date: '2026-03-28',
  },
  {
    id: 'demo-12',
    title: 'Internet and utilities',
    amount: 210,
    type: 'expense',
    category: 'Utilities',
    date: '2026-03-11',
  },
]

const defaultForm: TransactionForm = {
  title: '',
  amount: '',
  type: 'expense',
  category: expenseCategories[0],
  date: new Date().toISOString().slice(0, 10),
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`))

const getMonthLabel = (value: string) =>
  new Intl.DateTimeFormat('en-US', { month: 'short' }).format(
    new Date(`${value}T00:00:00`),
  )

const makeId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`

const readTransactions = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.transactions)
  if (stored === null) {
    return sampleTransactions
  }

  try {
    return JSON.parse(stored) as Transaction[]
  } catch {
    return sampleTransactions
  }
}

const readSettings = (): Settings => {
  const fallback: Settings = {
    theme: 'dark' as Theme,
    monthlyBudget: 5000,
    designVersion: DESIGN_VERSION,
  }
  const stored = localStorage.getItem(STORAGE_KEYS.settings)

  if (!stored) {
    return fallback
  }

  try {
    const parsed = { ...fallback, ...JSON.parse(stored) } as Settings
    return parsed.designVersion === DESIGN_VERSION
      ? parsed
      : { ...parsed, theme: 'dark' as Theme, designVersion: DESIGN_VERSION }
  } catch {
    return fallback
  }
}

const StatCard = ({
  label,
  value,
  helper,
  icon: Icon,
  tone,
}: {
  label: string
  value: string
  helper: string
  icon: LucideIcon
  tone: 'blue' | 'green' | 'orange' | 'teal'
}) => {
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
      <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">{helper}</p>
    </article>
  )
}

function App() {
  const [settings] = useState<Settings>(() => readSettings())
  const [transactions, setTransactions] = useState<Transaction[]>(readTransactions)
  const [theme, setTheme] = useState<Theme>(settings.theme)
  const [monthlyBudget, setMonthlyBudget] = useState(settings.monthlyBudget)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [form, setForm] = useState<TransactionForm>(defaultForm)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.settings,
      JSON.stringify({ theme, monthlyBudget, designVersion: DESIGN_VERSION }),
    )
  }, [theme, monthlyBudget])

  const totals = useMemo(() => {
    const income = transactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((sum, transaction) => sum + transaction.amount, 0)
    const expenses = transactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((sum, transaction) => sum + transaction.amount, 0)
    const balance = income - expenses

    return {
      income,
      expenses,
      balance,
      savings: Math.max(balance, 0),
      savingsRate: income > 0 ? Math.round((Math.max(balance, 0) / income) * 100) : 0,
    }
  }, [transactions])

  const currentMonthExpense = useMemo(() => {
    const now = new Date()
    return transactions
      .filter((transaction) => {
        const date = new Date(`${transaction.date}T00:00:00`)
        return (
          transaction.type === 'expense' &&
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        )
      })
      .reduce((sum, transaction) => sum + transaction.amount, 0)
  }, [transactions])

  const categories = useMemo(() => {
    const values = new Set([
      ...incomeCategories,
      ...expenseCategories,
      ...transactions.map((transaction) => transaction.category),
    ])
    return Array.from(values).sort()
  }, [transactions])

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase()

    return transactions
      .filter((transaction) => {
        const matchesSearch =
          transaction.title.toLowerCase().includes(query) ||
          transaction.category.toLowerCase().includes(query)
        const matchesType =
          typeFilter === 'all' || transaction.type === typeFilter
        const matchesCategory =
          categoryFilter === 'all' || transaction.category === categoryFilter

        return matchesSearch && matchesType && matchesCategory
      })
      .sort(
        (a, b) =>
          new Date(`${b.date}T00:00:00`).getTime() -
          new Date(`${a.date}T00:00:00`).getTime(),
      )
  }, [categoryFilter, search, transactions, typeFilter])

  const monthlyChart = useMemo(() => {
    const months = new Map<
      string,
      { month: string; income: number; expenses: number; sortDate: string }
    >()

    transactions.forEach((transaction) => {
      const monthKey = transaction.date.slice(0, 7)
      const existing = months.get(monthKey) ?? {
        month: getMonthLabel(transaction.date),
        income: 0,
        expenses: 0,
        sortDate: `${monthKey}-01`,
      }

      if (transaction.type === 'income') {
        existing.income += transaction.amount
      } else {
        existing.expenses += transaction.amount
      }

      months.set(monthKey, existing)
    })

    return Array.from(months.values())
      .sort((a, b) => a.sortDate.localeCompare(b.sortDate))
      .slice(-6)
  }, [transactions])

  const categoryChart = useMemo(() => {
    const expenseTotals = new Map<string, number>()

    transactions
      .filter((transaction) => transaction.type === 'expense')
      .forEach((transaction) => {
        expenseTotals.set(
          transaction.category,
          (expenseTotals.get(transaction.category) ?? 0) + transaction.amount,
        )
      })

    return Array.from(expenseTotals.entries()).map(([name, value], index) => ({
      name,
      value,
      color: categoryColors[index % categoryColors.length],
    }))
  }, [transactions])

  const budgetProgress =
    monthlyBudget > 0
      ? Math.min(Math.round((currentMonthExpense / monthlyBudget) * 100), 100)
      : 0

  const budgetRemaining = Math.max(monthlyBudget - currentMonthExpense, 0)
  const activeCategories =
    form.type === 'income' ? incomeCategories : expenseCategories

  const handleTypeChange = (type: TransactionType) => {
    setForm((current) => ({
      ...current,
      type,
      category: type === 'income' ? incomeCategories[0] : expenseCategories[0],
    }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const amount = Number(form.amount)
    if (!form.title.trim() || !Number.isFinite(amount) || amount <= 0) {
      return
    }

    setTransactions((current) => [
      {
        id: makeId(),
        title: form.title.trim(),
        amount,
        type: form.type,
        category: form.category,
        date: form.date,
      },
      ...current,
    ])
    setForm({
      ...defaultForm,
      type: form.type,
      category:
        form.type === 'income' ? incomeCategories[0] : expenseCategories[0],
    })
  }

  const resetDemoData = () => {
    setTransactions(sampleTransactions)
    setMonthlyBudget(5000)
    setSearch('')
    setTypeFilter('all')
    setCategoryFilter('all')
  }

  return (
    <main className={theme === 'dark' ? 'dark' : ''}>
      <div className="app-canvas min-h-screen text-slate-950 transition-colors dark:text-white">
        <div className="flex min-h-screen">
          <aside className="sidebar-shell sticky top-0 hidden h-screen w-72 shrink-0 border-r border-emerald-900/10 p-6 backdrop-blur lg:block dark:border-teal-300/10">
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
              {[
                ['Dashboard', LayoutDashboard],
                ['Transactions', CreditCard],
                ['Insights', LineChartIcon],
                ['Budget', PiggyBank],
                ['Settings', Settings],
              ].map(([label, Icon], index) => (
                <a
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                    index === 0
                      ? 'bg-teal-50 text-teal-800 shadow-sm dark:bg-teal-300/15 dark:text-teal-50 dark:shadow-teal-950/30'
                      : 'text-slate-600 hover:bg-teal-50/80 hover:text-teal-900 dark:text-zinc-400 dark:hover:bg-teal-300/10 dark:hover:text-teal-50'
                  }`}
                  href={`#${String(label).toLowerCase()}`}
                  key={label as string}
                >
                  <Icon size={18} />
                  {label as string}
                </a>
              ))}
            </nav>

            <div className="mt-10 rounded-lg border border-emerald-900/10 bg-white/55 p-4 shadow-sm backdrop-blur dark:border-teal-300/15 dark:bg-teal-300/5">
              <p className="text-sm font-semibold dark:text-teal-50">
                Portfolio ready
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-zinc-400">
                Local-first finance dashboard with real interactions, charts,
                and persistent settings.
              </p>
            </div>
          </aside>

          <section className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
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
                  Track freelance income, expenses, budget health, and spending
                  patterns without a backend or paid APIs.
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center xl:w-auto">
                <label className="glass-control flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-white/70 px-3 py-2.5 text-sm text-slate-500 sm:min-w-80 xl:w-80 dark:border-teal-300/20 dark:text-zinc-300">
                  <Search size={17} />
                  <input
                    className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search transactions"
                    type="search"
                    value={search}
                  />
                </label>
                <button
                  aria-label="Toggle dark mode"
                  className="glass-control inline-flex items-center justify-center gap-2 rounded-lg border border-white/70 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 dark:border-teal-300/20 dark:text-teal-50"
                  onClick={() =>
                    setTheme((current) =>
                      current === 'dark' ? 'light' : 'dark',
                    )
                  }
                  type="button"
                >
                  {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
                  {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                </button>
              </div>
            </header>

            <div className="mt-6 grid grid-cols-2 gap-2 lg:hidden">
              {['Dashboard', 'Transactions', 'Insights', 'Budget'].map((item) => (
                <a
                  className="glass-control rounded-lg border border-white/70 px-3 py-2 text-center text-sm font-semibold text-slate-700 dark:border-teal-300/15 dark:text-zinc-200"
                  href={`#${item.toLowerCase()}`}
                  key={item}
                >
                  {item}
                </a>
              ))}
            </div>

            <section
              className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
              id="dashboard"
            >
              <StatCard
                helper={`${transactions.length} saved transactions`}
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
                helper={`${totals.income > 0 ? Math.round((totals.expenses / totals.income) * 100) : 0}% of income`}
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
                      {filteredTransactions.length} matching records from search
                      and filters
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <select
                      className="rounded-lg border border-emerald-900/10 bg-white/80 px-3 py-2 text-sm outline-none dark:border-teal-300/20 dark:bg-black/40 dark:text-zinc-100"
                      onChange={(event) =>
                        setTypeFilter(
                          event.target.value as 'all' | TransactionType,
                        )
                      }
                      value={typeFilter}
                    >
                      <option value="all">All types</option>
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                    <select
                      className="rounded-lg border border-emerald-900/10 bg-white/80 px-3 py-2 text-sm outline-none dark:border-teal-300/20 dark:bg-black/40 dark:text-zinc-100"
                      onChange={(event) => setCategoryFilter(event.target.value)}
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
                    {filteredTransactions.map((transaction) => (
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
                            onClick={() =>
                              setTransactions((current) =>
                                current.filter(
                                  (item) => item.id !== transaction.id,
                                ),
                              )
                            }
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

              {filteredTransactions.length === 0 && (
                <div className="p-8 text-center">
                  <p className="font-semibold">No transactions found</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                    Try another search or clear your filters.
                  </p>
                </div>
              )}
            </article>

            <section className="mt-6 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
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

                <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-zinc-300">
                      Title
                    </label>
                    <input
                      className="mt-2 w-full rounded-lg border border-emerald-900/10 bg-white/80 px-3 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 dark:border-teal-300/20 dark:bg-black/40 dark:text-zinc-100"
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          title: event.target.value,
                        }))
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
                          setForm((current) => ({
                            ...current,
                            amount: event.target.value,
                          }))
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
                          setForm((current) => ({
                            ...current,
                            date: event.target.value,
                          }))
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
                        {(['expense', 'income'] as TransactionType[]).map(
                          (type) => (
                            <button
                              className={`rounded-md px-3 py-2 text-sm font-semibold capitalize transition ${
                                form.type === type
                                  ? 'bg-white text-teal-800 shadow-sm dark:bg-teal-300/15 dark:text-teal-50'
                                  : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
                              }`}
                              key={type}
                              onClick={() => handleTypeChange(type)}
                              type="button"
                            >
                              {type}
                            </button>
                          ),
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600 dark:text-zinc-300">
                        Category
                      </label>
                      <select
                        className="mt-2 w-full rounded-lg border border-emerald-900/10 bg-white/80 px-3 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 dark:border-teal-300/20 dark:bg-black/40 dark:text-zinc-100"
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            category: event.target.value,
                          }))
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

              <article
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900"
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
                      onChange={(event) =>
                        setMonthlyBudget(Number(event.target.value))
                      }
                      step="100"
                      type="number"
                      value={monthlyBudget}
                    />
                  </label>
                </div>

                <div className="mt-8">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-600 dark:text-zinc-300">
                      Budget progress
                    </span>
                    <span className="font-semibold">{budgetProgress}%</span>
                  </div>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`h-full rounded-full transition-all ${
                        budgetProgress > 90
                          ? 'bg-red-500'
                          : budgetProgress > 70
                            ? 'bg-orange-500'
                            : 'bg-teal-300'
                      }`}
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
                        {formatCurrency(
                          transactions.length
                            ? (totals.income + totals.expenses) /
                                transactions.length
                            : 0,
                        )}
                      </p>
                    </div>
                    <div className="rounded-lg bg-emerald-50/60 p-4 dark:bg-black/35">
                      <p className="text-sm text-slate-500 dark:text-zinc-400">
                        Status
                      </p>
                      <p className="mt-1 text-lg font-semibold">
                        {budgetProgress > 90
                          ? 'Tight'
                          : budgetProgress > 70
                            ? 'Watch'
                            : 'Healthy'}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </section>

            <section
              className="mt-6 grid gap-6 2xl:grid-cols-[1.15fr_0.85fr]"
              id="insights"
            >
              <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold dark:text-zinc-50">
                      Income vs expense
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-zinc-400">
                      Last six active months
                    </p>
                  </div>
                  <BarChart3 className="text-teal-700 dark:text-teal-200" />
                </div>
                <div className="mt-6 h-72">
                  <ResponsiveContainer height="100%" width="100%">
                    <BarChart data={monthlyChart}>
                      <CartesianGrid
                        stroke={theme === 'dark' ? '#1e293b' : '#e2e8f0'}
                        strokeDasharray="3 3"
                      />
                      <XAxis
                        dataKey="month"
                        stroke={theme === 'dark' ? '#94a3b8' : '#64748b'}
                        tickLine={false}
                      />
                      <YAxis
                        stroke={theme === 'dark' ? '#94a3b8' : '#64748b'}
                        tickFormatter={(value) => `$${Number(value) / 1000}k`}
                        tickLine={false}
                        width={45}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 8,
                          border: '1px solid #e2e8f0',
                        }}
                        formatter={(value) => formatCurrency(Number(value))}
                      />
                      <Bar
                        dataKey="income"
                        fill="#2dd4bf"
                        name="Income"
                        radius={[6, 6, 0, 0]}
                      />
                      <Bar
                        dataKey="expenses"
                        fill="#a3e635"
                        name="Expenses"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </article>

              <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
                <h2 className="text-lg font-semibold dark:text-zinc-50">
                  Expense categories
                </h2>
                <p className="text-sm text-slate-500 dark:text-zinc-400">
                  Where money is going
                </p>
                <div className="mt-6 grid gap-5 md:grid-cols-[1fr_0.8fr] 2xl:grid-cols-1">
                  <div className="h-64">
                    <ResponsiveContainer height="100%" width="100%">
                      <PieChart>
                        <Pie
                          data={categoryChart}
                          dataKey="value"
                          innerRadius={58}
                          outerRadius={92}
                          paddingAngle={4}
                        >
                          {categoryChart.map((entry) => (
                            <Cell fill={entry.color} key={entry.name} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3">
                    {categoryChart.slice(0, 5).map((category) => (
                      <div
                        className="flex items-center justify-between gap-3 text-sm"
                        key={category.name}
                      >
                        <span className="flex min-w-0 items-center gap-2 text-slate-600 dark:text-zinc-300">
                          <span
                            className="size-2.5 shrink-0 rounded-full"
                            style={{ background: category.color }}
                          />
                          <span className="truncate">{category.name}</span>
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(category.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            </section>

            <section className="mt-6">
              <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold dark:text-zinc-50">
                      Monthly spending
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-zinc-400">
                      Expense trend over time
                    </p>
                  </div>
                  <CalendarDays className="text-cyan-600 dark:text-cyan-300" />
                </div>
                <div className="mt-6 h-64">
                  <ResponsiveContainer height="100%" width="100%">
                    <LineChart data={monthlyChart}>
                      <CartesianGrid
                        stroke={theme === 'dark' ? '#1e293b' : '#e2e8f0'}
                        strokeDasharray="3 3"
                      />
                      <XAxis
                        dataKey="month"
                        stroke={theme === 'dark' ? '#94a3b8' : '#64748b'}
                        tickLine={false}
                      />
                      <YAxis
                        stroke={theme === 'dark' ? '#94a3b8' : '#64748b'}
                        tickFormatter={(value) => `$${Number(value) / 1000}k`}
                        tickLine={false}
                        width={45}
                      />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Line
                        dataKey="expenses"
                        dot={{ fill: '#2dd4bf', r: 4 }}
                        name="Expenses"
                        stroke="#2dd4bf"
                        strokeWidth={3}
                        type="monotone"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </article>
            </section>

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
                    A dark, responsive portfolio dashboard for tracking freelance
                    cash flow, expenses, budgets, and spending patterns. All data
                    stays in your browser with localStorage.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-slate-900 dark:text-zinc-50">
                    Sections
                  </p>
                  <div className="mt-3 grid gap-2">
                    {['Dashboard', 'Transactions', 'Insights', 'Budget'].map(
                      (item) => (
                        <a
                          className="transition hover:text-teal-700 dark:hover:text-teal-200"
                          href={`#${item.toLowerCase()}`}
                          key={item}
                        >
                          {item}
                        </a>
                      ),
                    )}
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
                <p>
                  © 2026 MoneyMate. Built for a clean freelancer portfolio.
                </p>
                <button
                  className="glass-control inline-flex w-fit items-center gap-2 rounded-lg border border-white/70 px-3 py-2 font-semibold text-slate-700 transition hover:-translate-y-0.5 dark:border-teal-300/15 dark:text-teal-50"
                  onClick={resetDemoData}
                  type="button"
                >
                  Reset demo data
                </button>
              </div>
            </footer>
          </section>
        </div>
      </div>
    </main>
  )
}

export default App
