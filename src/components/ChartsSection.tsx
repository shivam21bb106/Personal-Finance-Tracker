import { BarChart3, CalendarDays } from 'lucide-react'
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
import type {
  CategoryChartPoint,
  MonthlyChartPoint,
  Theme,
} from '../types/finance'
import { formatCurrency } from '../utils/finance'

type ChartsSectionProps = {
  categoryChart: CategoryChartPoint[]
  monthlyChart: MonthlyChartPoint[]
  theme: Theme
  totalExpenses: number
}

const getAxisColor = (theme: Theme) =>
  theme === 'dark' ? '#94a3b8' : '#64748b'

const getGridColor = (theme: Theme) =>
  theme === 'dark' ? '#1e293b' : '#e2e8f0'

export function ChartsSection({
  categoryChart,
  monthlyChart,
  theme,
  totalExpenses,
}: ChartsSectionProps) {
  return (
    <>
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
                  stroke={getGridColor(theme)}
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="month"
                  stroke={getAxisColor(theme)}
                  tickLine={false}
                />
                <YAxis
                  stroke={getAxisColor(theme)}
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
          <div className="mt-6 grid items-center gap-6 lg:grid-cols-[1.05fr_0.95fr] 2xl:grid-cols-1">
            <div className="relative mx-auto h-80 w-full max-w-md">
              <ResponsiveContainer height="100%" width="100%">
                <PieChart>
                  <Pie
                    data={categoryChart}
                    dataKey="value"
                    innerRadius={82}
                    outerRadius={124}
                    paddingAngle={4}
                    stroke="rgba(5, 6, 5, 0.9)"
                    strokeWidth={3}
                  >
                    {categoryChart.map((entry) => (
                      <Cell fill={entry.color} key={entry.name} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-zinc-500">
                    Total
                  </p>
                  <p className="font-['Space_Grotesk'] text-2xl font-bold text-slate-950 dark:text-zinc-50">
                    {formatCurrency(totalExpenses)}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3 lg:pl-2">
              {categoryChart.slice(0, 5).map((category) => (
                <div
                  className="flex items-center justify-between gap-4 rounded-lg border border-transparent px-3 py-2 text-sm transition dark:hover:border-teal-300/10 dark:hover:bg-teal-300/5"
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
                  stroke={getGridColor(theme)}
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="month"
                  stroke={getAxisColor(theme)}
                  tickLine={false}
                />
                <YAxis
                  stroke={getAxisColor(theme)}
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
    </>
  )
}
