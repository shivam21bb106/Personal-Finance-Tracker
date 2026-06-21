import type { Settings, Transaction, TransactionForm, TransactionType } from '../types/finance'

export const STORAGE_KEYS = {
  transactions: 'moneymate.transactions',
  settings: 'moneymate.settings',
}

export const DESIGN_VERSION = 'dark-gen-4'

export const incomeCategories = [
  'Client Work',
  'Consulting',
  'Retainer',
  'Product Sales',
  'Investments',
  'Other Income',
]

export const expenseCategories = [
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

export const categoryColors = [
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

export const sampleTransactions: Transaction[] = [
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

export const getDefaultCategory = (type: TransactionType) =>
  type === 'income' ? incomeCategories[0] : expenseCategories[0]

export const createDefaultForm = (
  type: TransactionType = 'expense',
): TransactionForm => ({
  title: '',
  amount: '',
  type,
  category: getDefaultCategory(type),
  date: new Date().toISOString().slice(0, 10),
})

export const createDefaultSettings = (): Settings => ({
  theme: 'dark',
  monthlyBudget: 5000,
  designVersion: DESIGN_VERSION,
})

export const parseStoredSettings = (value: string): Settings => {
  const fallback = createDefaultSettings()
  const parsed = { ...fallback, ...JSON.parse(value) } as Settings

  return parsed.designVersion === DESIGN_VERSION
    ? parsed
    : { ...parsed, theme: 'dark', designVersion: DESIGN_VERSION }
}
