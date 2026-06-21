const mobileNavItems = ['Dashboard', 'Transactions', 'Insights', 'Budget']

export function MobileNav() {
  return (
    <div className="mt-6 grid grid-cols-2 gap-2 lg:hidden">
      {mobileNavItems.map((item) => (
        <a
          className="glass-control rounded-lg border border-white/70 px-3 py-2 text-center text-sm font-semibold text-slate-700 dark:border-teal-300/15 dark:text-zinc-200"
          href={`#${item.toLowerCase()}`}
          key={item}
        >
          {item}
        </a>
      ))}
    </div>
  )
}
