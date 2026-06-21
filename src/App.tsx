import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { AppFooter } from './components/AppFooter'
import { BudgetTracker } from './components/BudgetTracker'
import { ChartsSection } from './components/ChartsSection'
import { DashboardHeader } from './components/DashboardHeader'
import { MobileNav } from './components/MobileNav'
import { Sidebar } from './components/Sidebar'
import { SummaryCards } from './components/SummaryCards'
import { TransactionFormCard } from './components/TransactionFormCard'
import { TransactionsTable } from './components/TransactionsTable'
import {
  createDefaultForm,
  createDefaultSettings,
  DESIGN_VERSION,
  expenseCategories,
  getDefaultCategory,
  incomeCategories,
  parseStoredSettings,
  sampleTransactions,
  STORAGE_KEYS,
} from './data/finance'
import { useLocalStorageState } from './hooks/useLocalStorageState'
import type { Settings, Transaction, TransactionForm, TransactionType } from './types/finance'
import {
  calculateTotals,
  filterTransactions,
  getBudgetProgress,
  getCategories,
  getCategoryChart,
  getCurrentMonthExpense,
  getMonthlyChart,
  makeId,
} from './utils/finance'

export function App() {
  const [transactions, setTransactions] = useLocalStorageState<Transaction[]>(
    STORAGE_KEYS.transactions,
    () => sampleTransactions,
  )
  const [settings, setSettings] = useLocalStorageState<Settings>(
    STORAGE_KEYS.settings,
    createDefaultSettings,
    { deserialize: parseStoredSettings },
  )
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [form, setForm] = useState<TransactionForm>(() => createDefaultForm())

  const { theme, monthlyBudget } = settings

  const totals = useMemo(() => calculateTotals(transactions), [transactions])
  const currentMonthExpense = useMemo(
    () => getCurrentMonthExpense(transactions),
    [transactions],
  )
  const categories = useMemo(() => getCategories(transactions), [transactions])
  const filteredTransactions = useMemo(
    () =>
      filterTransactions({
        transactions,
        search,
        typeFilter,
        categoryFilter,
      }),
    [categoryFilter, search, transactions, typeFilter],
  )
  const monthlyChart = useMemo(
    () => getMonthlyChart(transactions),
    [transactions],
  )
  const categoryChart = useMemo(
    () => getCategoryChart(transactions),
    [transactions],
  )

  const budgetProgress = getBudgetProgress(currentMonthExpense, monthlyBudget)
  const budgetRemaining = Math.max(monthlyBudget - currentMonthExpense, 0)
  const averageTransaction = transactions.length
    ? (totals.income + totals.expenses) / transactions.length
    : 0
  const activeCategories =
    form.type === 'income' ? incomeCategories : expenseCategories

  const updateSettings = (updates: Partial<Omit<Settings, 'designVersion'>>) => {
    setSettings((current) => ({
      ...current,
      ...updates,
      designVersion: DESIGN_VERSION,
    }))
  }

  const handleTypeChange = (type: TransactionType) => {
    setForm((current) => ({
      ...current,
      type,
      category: getDefaultCategory(type),
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
    setForm(createDefaultForm(form.type))
  }

  const resetViewState = () => {
    setSearch('')
    setTypeFilter('all')
    setCategoryFilter('all')
  }

  const clearAllData = () => {
    setTransactions([])
    updateSettings({ monthlyBudget: 0 })
    resetViewState()
  }

  const loadDemoData = () => {
    setTransactions(sampleTransactions)
    updateSettings({ monthlyBudget: 5000 })
    resetViewState()
  }

  return (
    <main className={theme === 'dark' ? 'dark' : ''}>
      <div className="app-canvas min-h-screen text-slate-950 transition-colors dark:text-white">
        <div className="min-h-screen">
          <Sidebar />

          <section className="min-w-0 p-4 sm:p-6 lg:ml-72 lg:p-8">
            <DashboardHeader
              onSearchChange={setSearch}
              onToggleTheme={() =>
                updateSettings({
                  theme: theme === 'dark' ? 'light' : 'dark',
                })
              }
              search={search}
              theme={theme}
            />
            <MobileNav />
            <SummaryCards
              totals={totals}
              transactionCount={transactions.length}
            />
            <TransactionsTable
              categories={categories}
              categoryFilter={categoryFilter}
              onCategoryFilterChange={setCategoryFilter}
              onDeleteTransaction={(id) =>
                setTransactions((current) =>
                  current.filter((transaction) => transaction.id !== id),
                )
              }
              onTypeFilterChange={setTypeFilter}
              transactions={filteredTransactions}
              typeFilter={typeFilter}
            />

            <section className="mt-6 grid gap-6 xl:grid-cols-[0.8fr_1.2fr] xl:items-start">
              <TransactionFormCard
                activeCategories={activeCategories}
                form={form}
                onFormChange={setForm}
                onSubmit={handleSubmit}
                onTypeChange={handleTypeChange}
              />
              <BudgetTracker
                averageTransaction={averageTransaction}
                budgetProgress={budgetProgress}
                budgetRemaining={budgetRemaining}
                currentMonthExpense={currentMonthExpense}
                monthlyBudget={monthlyBudget}
                onBudgetChange={(value) => updateSettings({ monthlyBudget: value })}
                transactionCount={transactions.length}
              />
            </section>

            <ChartsSection
              categoryChart={categoryChart}
              monthlyChart={monthlyChart}
              theme={theme}
              totalExpenses={totals.expenses}
            />
            <AppFooter
              onClearAllData={clearAllData}
              onLoadDemoData={loadDemoData}
            />
          </section>
        </div>
      </div>
    </main>
  )
}
