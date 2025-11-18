import { useState, useEffect } from "react";
import { PieChart, Plus, TrendingDown, Pencil, Trash2 } from "lucide-react";
import AddBudgetModal from "./AddBudgetModal";

const BUDGETS_STORAGE_KEY = "monarch_budgets";

const initialBudgets = [
  { id: 1, name: "Groceries", amount: 600, spent: 420, color: "bg-emerald-500" },
  { id: 2, name: "Dining", amount: 300, spent: 220, color: "bg-indigo-500" },
  { id: 3, name: "Transport", amount: 180, spent: 140, color: "bg-amber-500" },
  { id: 4, name: "Shopping", amount: 400, spent: 365, color: "bg-rose-500" },
];

// Load budgets from localStorage
const loadBudgetsFromStorage = () => {
  try {
    const stored = localStorage.getItem(BUDGETS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Error loading budgets from localStorage:", error);
  }
  return initialBudgets;
};

// Save budgets to localStorage
const saveBudgetsToStorage = (budgets) => {
  try {
    localStorage.setItem(BUDGETS_STORAGE_KEY, JSON.stringify(budgets));
  } catch (error) {
    console.error("Error saving budgets to localStorage:", error);
  }
};

function ProgressBar({ spent, amount, color }) {
  const pct = Math.min(100, Math.round((spent / amount) * 100));
  return (
    <div className="w-full h-2 rounded-full bg-slate-100">
      <div
        className={`h-2 rounded-full ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function Budgets({ searchQuery = "" }) {
  const [budgets, setBudgets] = useState(() => loadBudgetsFromStorage());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [showAll, setShowAll] = useState(false);

  // Save budgets to localStorage whenever they change
  useEffect(() => {
    saveBudgetsToStorage(budgets);
  }, [budgets]);

  // Reset showAll when search query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      setShowAll(false);
    }
  }, [searchQuery]);

  const handleAddBudget = (newBudget) => {
    const maxId = budgets.length > 0 ? Math.max(...budgets.map(b => b.id)) : 0;
    const budgetWithId = {
      ...newBudget,
      id: maxId + 1,
      spent: newBudget.spent || 0,
    };
    setBudgets([...budgets, budgetWithId]);
  };

  const handleUpdateBudget = (id, updatedBudget) => {
    setBudgets(budgets.map(b => 
      b.id === id ? { ...updatedBudget, id } : b
    ));
  };

  const handleDeleteBudget = (id) => {
    const budget = budgets.find(b => b.id === id);
    if (budget && window.confirm(`Are you sure you want to delete the "${budget.name}" budget?`)) {
      setBudgets(budgets.filter(b => b.id !== id));
    }
  };

  const handleOpenModal = () => {
    setEditingBudget(null);
    setIsModalOpen(true);
  };

  const handleEditBudget = (budget) => {
    setEditingBudget(budget);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBudget(null);
  };

  // Filter budgets based on search query
  const filteredBudgets = budgets.filter((b) => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      b.name.toLowerCase().includes(query) ||
      b.amount.toString().includes(query) ||
      b.spent.toString().includes(query)
    );
  });

  // Limit to 3 budgets if not showing all and no search query
  const displayBudgets = showAll || searchQuery.trim() 
    ? filteredBudgets 
    : filteredBudgets.slice(0, 3);

  const hasMoreBudgets = filteredBudgets.length > 3;

  return (
    <main className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      <div className="mb-4 sm:mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Budgets</h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">Stay on track with monthly spending limits by category.</p>
        </div>
        <button 
          onClick={handleOpenModal}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm shadow hover:bg-indigo-700 transition"
        >
          <Plus className="h-4 w-4" />
          New Budget
        </button>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="px-3 sm:px-4 md:px-5 py-3 sm:py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h3 className="text-xs sm:text-sm font-semibold text-slate-700">
            {showAll ? "Budgets" : "Recent Budgets"}
            {searchQuery && (
              <span className="ml-2 text-xs text-slate-500 font-normal">
                ({filteredBudgets.length} {filteredBudgets.length === 1 ? 'result' : 'results'})
              </span>
            )}
          </h3>
          {hasMoreBudgets && !searchQuery.trim() && (
            <button 
              onClick={() => setShowAll(!showAll)}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium self-start sm:self-auto"
            >
              {showAll ? "Show less" : `View all (${filteredBudgets.length})`}
            </button>
          )}
        </div>
        {displayBudgets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-5">
            {displayBudgets.map((b) => {
          const remaining = Math.max(0, b.amount - b.spent);
          const pct = Math.round((b.spent / b.amount) * 100);
          const over = b.spent > b.amount;
          return (
            <div key={b.id} className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`h-8 w-8 sm:h-9 sm:w-9 rounded-lg ${b.color} text-white flex items-center justify-center flex-shrink-0`}>
                    <PieChart className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <h3 className="text-sm font-medium text-slate-900 truncate">{b.name}</h3>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                  <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${over ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>
                    {over ? "Over" : `${pct}%`}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditBudget(b)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                      title="Edit budget"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBudget(b.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Delete budget"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <ProgressBar spent={b.spent} amount={b.amount} color={b.color} />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 text-xs sm:text-sm">
                  <span className="text-slate-600">Spent ${b.spent.toLocaleString()} / ${b.amount.toLocaleString()}</span>
                  <span className={`${over ? "text-rose-600" : "text-slate-700"}`}>
                    {over ? (
                      <span className="inline-flex items-center gap-1"><TrendingDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />Over by ${Math.abs(remaining).toLocaleString()}</span>
                    ) : (
                      <span>Left ${remaining.toLocaleString()}</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
          </div>
        ) : (
          <div className="px-3 sm:px-4 md:px-5 py-6 sm:py-8 text-center">
            <p className="text-xs sm:text-sm text-slate-500">
              {searchQuery.trim() 
                ? `No budgets found matching "${searchQuery}"`
                : "No budgets yet. Create your first budget to get started!"}
            </p>
          </div>
        )}
      </section>

      <AddBudgetModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddBudget={handleAddBudget}
        onUpdateBudget={handleUpdateBudget}
        editingBudget={editingBudget}
      />
    </main>
  );
}
