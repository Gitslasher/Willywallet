import { TrendingDown, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { loadBudgets, loadGoals } from "../lib/userData";

// Simple line chart component
function SimpleLineChart({ data, color = "indigo" }) {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.value - minValue) / range) * 100;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="h-32 w-full">
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke={color === "indigo" ? "#6366f1" : "#f59e0b"}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

// Budget Progress Bar
function BudgetProgressBar({ label, spent, budget, color }) {
  const percentage = Math.min(100, Math.round((spent / budget) * 100));
  const remaining = Math.max(0, budget - spent);
  const over = spent > budget;
  
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-600">{label}</span>
        <span className="text-slate-500">${spent.toLocaleString()} / ${budget.toLocaleString()}</span>
      </div>
      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className={over ? "text-rose-600" : "text-slate-500"}>
          {over ? `Over by $${Math.abs(remaining).toLocaleString()}` : `$${remaining.toLocaleString()} remaining`}
        </span>
        <span className="text-slate-400">{percentage}%</span>
      </div>
    </div>
  );
}

export default function Overview({ searchQuery = "", transactions = [], onEditTransaction, onDeleteTransaction, onNavigateToTransactions }) {
  const budgets = loadBudgets();
  const goals = loadGoals();
  
  // Calculate summary stats
  const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));
  const netWorth = totalIncome - totalExpenses;
  
  // Get recent transactions (limit to 3)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);
  
  // Get recent budgets (limit to 3, sorted by ID descending to get most recent)
  const recentBudgets = [...budgets]
    .sort((a, b) => (b.id || 0) - (a.id || 0))
    .slice(0, 3);
  
  // Mock spending data for chart
  const spendingData = Array.from({ length: 31 }, (_, i) => ({
    day: i + 1,
    value: Math.random() * 2000 + 1000 + (i * 50)
  }));
  
  // Mock net worth data
  const netWorthData = Array.from({ length: 30 }, (_, i) => ({
    date: i,
    value: 120000 + Math.sin(i / 5) * 5000 + Math.random() * 2000
  }));

  return (
    <main className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 text-xs sm:text-sm mt-1">
          Track your net worth, accounts, and spending in one clean dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Budget Card */}
        <div className="lg:col-span-1 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Recent Budgets</h3>
            <select className="text-xs border border-slate-200 rounded px-2 py-1 text-slate-600">
              <option>Expenses</option>
            </select>
          </div>
          <div className="space-y-4">
            {recentBudgets.length > 0 ? (
              recentBudgets.map((budget) => (
                <BudgetProgressBar 
                  key={budget.id}
                  label={budget.name} 
                  spent={budget.spent || 0} 
                  budget={budget.amount || 0} 
                  color={budget.color || "bg-indigo-500"} 
                />
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-4">No budgets yet</p>
            )}
          </div>
        </div>

        {/* Spending Card */}
        <div className="lg:col-span-1 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Spending this month</h3>
            <select className="text-xs border border-slate-200 rounded px-2 py-1 text-slate-600">
              <option>This month vs. last year</option>
            </select>
          </div>
          {/* Day markers */}
          <div className="flex justify-between mb-2 text-xs text-slate-600">
            <span>Day 3</span>
            <span>Day 6</span>
            <span>Day 9</span>
            <span>Day 12</span>
            <span>Day 15</span>
            <span>Day 18</span>
            <span>Day 21</span>
            <span>Day 24</span>
            <span>Day 27</span>
            <span>Day 31</span>
          </div>
          <div className="h-32">
            <SimpleLineChart data={spendingData} color="orange" />
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs justify-center">
            <div className="flex items-center gap-1.5">
              <svg className="w-8 h-0.5" viewBox="0 0 32 2" preserveAspectRatio="none">
                <line x1="0" y1="1" x2="32" y2="1" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 2" />
              </svg>
              <span className="text-slate-600">This month</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-8 h-0.5" viewBox="0 0 32 2" preserveAspectRatio="none">
                <line x1="0" y1="1" x2="32" y2="1" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 2" />
              </svg>
              <span className="text-slate-600">This month last year</span>
            </div>
          </div>
        </div>

        {/* Net Worth Card */}
        <div className="lg:col-span-1 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Net Worth</h3>
              <p className="text-xs text-slate-500 mt-0.5">${netWorth.toLocaleString()} (0%)</p>
            </div>
            <select className="text-xs border border-slate-200 rounded px-2 py-1 text-slate-600">
              <option>1 month</option>
            </select>
          </div>
          <div className="h-32">
            <SimpleLineChart data={netWorthData} color="indigo" />
          </div>
        </div>

        {/* Recent Transactions Card */}
        <div className="lg:col-span-1 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Recent Transactions</h3>
            <select className="text-xs border border-slate-200 rounded px-2 py-1 text-slate-600">
              <option>All transactions</option>
            </select>
          </div>
          <div className="space-y-3">
            {recentTransactions.length > 0 ? (
              <>
                {recentTransactions.map((t) => (
                  <div key={t.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className={`h-6 w-6 rounded flex items-center justify-center flex-shrink-0 ${
                        t.amount < 0 ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                      }`}>
                        {t.amount < 0 ? (
                          <ArrowDownRight className="h-3 w-3" />
                        ) : (
                          <ArrowUpRight className="h-3 w-3" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-900 truncate">{t.merchant}</p>
                        <p className="text-xs text-slate-500 truncate">{t.category}</p>
                      </div>
                    </div>
                    <div className={`text-xs font-semibold flex-shrink-0 ${t.amount < 0 ? "text-rose-600" : "text-emerald-700"}`}>
                      {t.amount < 0 ? "-" : "+"}${Math.abs(t.amount).toLocaleString()}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-xs text-slate-500 text-center py-4">No transactions yet</p>
            )}
          </div>
        </div>

        {/* Goals Card */}
        <div className="lg:col-span-1 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Recent Goals</h3>
          </div>
          {goals.length > 0 ? (
            <div className="space-y-3">
              {[...goals]
                .sort((a, b) => new Date(b.due || 0) - new Date(a.due || 0))
                .slice(0, 3)
                .map((g) => {
                const pct = Math.round((g.saved / g.target) * 100);
                return (
                  <div key={g.id} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-900 uppercase">{g.name}</span>
                      <span className="text-slate-500">{pct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100">
                      <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">${g.saved.toLocaleString()} / ${g.target.toLocaleString()}</span>
                      <div className="flex items-center gap-1 text-rose-600">
                        <TrendingDown className="h-3 w-3" />
                        <span>This month</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center py-4">No goals yet</p>
          )}
        </div>

        {/* Recurring Card */}
        <div className="lg:col-span-1 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Recurring</h3>
            <select className="text-xs border border-slate-200 rounded px-2 py-1 text-slate-600">
              <option>This month</option>
            </select>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ArrowUpRight className="h-3 w-3" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-900">Deposit</p>
                  <p className="text-xs text-slate-500">Merchant • Every year</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-emerald-700">+$1.61</p>
                <p className="text-xs text-slate-500">Today</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
