import {
  BarChart3,
  CreditCard,
  LayoutDashboard,
  LineChart as LineChartIcon,
  PiggyBank,
  Plus,
  Search,
  Settings,
  Wallet,
} from 'lucide-react'
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

const monthlyData = [
  { month: 'Jan', income: 6200, expenses: 3400 },
  { month: 'Feb', income: 6400, expenses: 3900 },
  { month: 'Mar', income: 7100, expenses: 4200 },
  { month: 'Apr', income: 6800, expenses: 3600 },
  { month: 'May', income: 7400, expenses: 4100 },
  { month: 'Jun', income: 7800, expenses: 4550 },
]

const categoryData = [
  { name: 'Workspace', value: 980, color: '#2563eb' },
  { name: 'Software', value: 720, color: '#14b8a6' },
  { name: 'Travel', value: 520, color: '#f97316' },
  { name: 'Utilities', value: 410, color: '#7c3aed' },
]

const transactions = [
  {
    title: 'Client retainer',
    category: 'Income',
    date: 'Jun 18, 2026',
    amount: '+$3,200',
  },
  {
    title: 'Design software',
    category: 'Software',
    date: 'Jun 16, 2026',
    amount: '-$84',
  },
  {
    title: 'Coworking pass',
    category: 'Workspace',
    date: 'Jun 12, 2026',
    amount: '-$180',
  },
]

const cards = [
  {
    label: 'Total balance',
    value: '$24,680',
    change: '+12.4% this month',
    icon: Wallet,
  },
  {
    label: 'Income',
    value: '$7,800',
    change: '+8.1% from May',
    icon: CreditCard,
  },
  {
    label: 'Expenses',
    value: '$4,550',
    change: '58% of income',
    icon: BarChart3,
  },
  {
    label: 'Savings',
    value: '$3,250',
    change: '$1,750 left to goal',
    icon: PiggyBank,
  },
]

function App() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-slate-200 bg-white p-6 lg:block">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-lg bg-blue-600 text-white">
              <Wallet size={22} />
            </div>
            <div>
              <p className="text-lg font-semibold">MoneyMate</p>
              <p className="text-sm text-slate-500">Finance dashboard</p>
            </div>
          </div>

          <nav className="mt-10 space-y-2">
            {[
              ['Dashboard', LayoutDashboard],
              ['Transactions', CreditCard],
              ['Insights', LineChartIcon],
              ['Settings', Settings],
            ].map(([label, Icon]) => (
              <a
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 first:bg-blue-50 first:text-blue-700"
                href="#"
                key={label as string}
              >
                <Icon size={18} />
                {label as string}
              </a>
            ))}
          </nav>
        </aside>

        <section className="flex-1 p-4 sm:p-6 lg:p-8">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Welcome back</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
                MoneyMate dashboard
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 shadow-sm sm:w-72">
                <Search size={17} />
                <input
                  className="w-full bg-transparent outline-none"
                  placeholder="Search transactions"
                  type="search"
                />
              </label>
              <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
                <Plus size={17} />
                Add
              </button>
            </div>
          </header>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
              <article
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                key={card.label}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">{card.label}</p>
                  <div className="grid size-10 place-items-center rounded-lg bg-slate-100 text-blue-700">
                    <card.icon size={19} />
                  </div>
                </div>
                <p className="mt-5 text-2xl font-semibold tracking-tight">
                  {card.value}
                </p>
                <p className="mt-1 text-sm text-slate-500">{card.change}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Income vs expenses</h2>
                  <p className="text-sm text-slate-500">
                    Monthly freelance cash flow
                  </p>
                </div>
              </div>
              <div className="mt-6 h-72">
                <ResponsiveContainer height="100%" width="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                    <XAxis dataKey="month" stroke="#64748b" tickLine={false} />
                    <YAxis stroke="#64748b" tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="income" fill="#2563eb" radius={[6, 6, 0, 0]} />
                    <Bar
                      dataKey="expenses"
                      fill="#14b8a6"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold">Expense categories</h2>
              <p className="text-sm text-slate-500">Current month allocation</p>
              <div className="mt-6 h-72">
                <ResponsiveContainer height="100%" width="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      innerRadius={62}
                      outerRadius={96}
                      paddingAngle={4}
                    >
                      {categoryData.map((entry) => (
                        <Cell fill={entry.color} key={entry.name} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </article>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold">Monthly budget</h2>
              <p className="text-sm text-slate-500">$4,550 of $6,000 used</p>
              <div className="mt-5 h-3 rounded-full bg-slate-100">
                <div className="h-3 w-[76%] rounded-full bg-blue-600" />
              </div>
              <p className="mt-4 text-sm font-medium text-slate-700">
                24% remaining for June
              </p>
            </article>

            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold">Monthly spending trend</h2>
              <div className="mt-5 h-52">
                <ResponsiveContainer height="100%" width="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                    <XAxis dataKey="month" stroke="#64748b" tickLine={false} />
                    <YAxis stroke="#64748b" tickLine={false} />
                    <Tooltip />
                    <Line
                      dataKey="expenses"
                      dot={false}
                      stroke="#2563eb"
                      strokeWidth={3}
                      type="monotone"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </article>
          </div>

          <article className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <h2 className="text-lg font-semibold">Recent transactions</h2>
              <p className="text-sm text-slate-500">
                Demo data for the first MoneyMate milestone
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Transaction</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map((transaction) => (
                    <tr key={transaction.title}>
                      <td className="px-5 py-4 font-medium text-slate-900">
                        {transaction.title}
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        {transaction.category}
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        {transaction.date}
                      </td>
                      <td className="px-5 py-4 text-right font-semibold">
                        {transaction.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>
      </div>
    </main>
  )
}

export default App
