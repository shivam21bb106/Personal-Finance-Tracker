export type TransactionType = 'income' | 'expense'

export type Theme = 'light' | 'dark'

export type Transaction = {
  id: string
  title: string
  amount: number
  type: TransactionType
  category: string
  date: string
}

export type TransactionForm = {
  title: string
  amount: string
  type: TransactionType
  category: string
  date: string
}

export type Settings = {
  theme: Theme
  monthlyBudget: number
  designVersion: string
}

export type SummaryTotals = {
  income: number
  expenses: number
  balance: number
  savings: number
  savingsRate: number
}

export type MonthlyChartPoint = {
  month: string
  income: number
  expenses: number
  sortDate: string
}

export type CategoryChartPoint = {
  name: string
  value: number
  color: string
}
