import { categoryColors, expenseCategories, incomeCategories } from '../data/finance'
import type {
  CategoryChartPoint,
  MonthlyChartPoint,
  SummaryTotals,
  Transaction,
  TransactionType,
} from '../types/finance'

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`))

export const getMonthLabel = (value: string) =>
  new Intl.DateTimeFormat('en-US', { month: 'short' }).format(
    new Date(`${value}T00:00:00`),
  )

export const makeId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`

export const calculateTotals = (
  transactions: Transaction[],
): SummaryTotals => {
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
    savingsRate:
      income > 0 ? Math.round((Math.max(balance, 0) / income) * 100) : 0,
  }
}

export const getCurrentMonthExpense = (transactions: Transaction[]) => {
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
}

export const getCategories = (transactions: Transaction[]) => {
  const values = new Set([
    ...incomeCategories,
    ...expenseCategories,
    ...transactions.map((transaction) => transaction.category),
  ])

  return Array.from(values).sort()
}

export const filterTransactions = ({
  transactions,
  search,
  typeFilter,
  categoryFilter,
}: {
  transactions: Transaction[]
  search: string
  typeFilter: 'all' | TransactionType
  categoryFilter: string
}) => {
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
}

export const getMonthlyChart = (
  transactions: Transaction[],
): MonthlyChartPoint[] => {
  const months = new Map<string, MonthlyChartPoint>()

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
}

export const getCategoryChart = (
  transactions: Transaction[],
): CategoryChartPoint[] => {
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
}

export const getBudgetProgress = (
  currentMonthExpense: number,
  monthlyBudget: number,
) =>
  monthlyBudget > 0
    ? Math.min(Math.round((currentMonthExpense / monthlyBudget) * 100), 100)
    : 0
