import { useState, useEffect } from "react";
import { Target, Plus, CalendarDays, CheckCircle2, Pencil, Trash2 } from "lucide-react";
import AddGoalModal from "./AddGoalModal";

const GOALS_STORAGE_KEY = "monarch_goals";

const initialGoals = [
  { id: 1, name: "Emergency Fund", target: 10000, saved: 6200, due: "2026-06-01" },
  { id: 2, name: "Hawaii Trip", target: 4500, saved: 1900, due: "2025-08-15" },
  { id: 3, name: "New Laptop", target: 2200, saved: 900, due: "2025-12-01" },
];

// Load goals from localStorage
const loadGoalsFromStorage = () => {
  try {
    const stored = localStorage.getItem(GOALS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Error loading goals from localStorage:", error);
  }
  return initialGoals;
};

// Save goals to localStorage
const saveGoalsToStorage = (goals) => {
  try {
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
  } catch (error) {
    console.error("Error saving goals to localStorage:", error);
  }
};

function GoalProgress({ saved, target }) {
  const pct = Math.min(100, Math.round((saved / target) * 100));
  return (
    <div className="w-full h-2 rounded-full bg-slate-100">
      <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function Goals({ searchQuery = "" }) {
  const [goals, setGoals] = useState(() => loadGoalsFromStorage());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [showAll, setShowAll] = useState(false);

  // Save goals to localStorage whenever they change
  useEffect(() => {
    saveGoalsToStorage(goals);
  }, [goals]);

  // Reset showAll when search query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      setShowAll(false);
    }
  }, [searchQuery]);

  const handleAddGoal = (newGoal) => {
    const maxId = goals.length > 0 ? Math.max(...goals.map(g => g.id)) : 0;
    const goalWithId = {
      ...newGoal,
      id: maxId + 1,
      saved: newGoal.saved || 0,
    };
    setGoals([...goals, goalWithId]);
  };

  const handleUpdateGoal = (id, updatedGoal) => {
    setGoals(goals.map(g => 
      g.id === id ? { ...updatedGoal, id } : g
    ));
  };

  const handleDeleteGoal = (id) => {
    const goal = goals.find(g => g.id === id);
    if (goal && window.confirm(`Are you sure you want to delete the "${goal.name}" goal?`)) {
      setGoals(goals.filter(g => g.id !== id));
    }
  };

  const handleOpenModal = () => {
    setEditingGoal(null);
    setIsModalOpen(true);
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGoal(null);
  };

  // Filter goals based on search query
  const filteredGoals = goals.filter((g) => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      g.name.toLowerCase().includes(query) ||
      g.target.toString().includes(query) ||
      g.saved.toString().includes(query) ||
      g.due.toLowerCase().includes(query)
    );
  });

  // Limit to 3 goals if not showing all and no search query
  const displayGoals = showAll || searchQuery.trim() 
    ? filteredGoals 
    : filteredGoals.slice(0, 3);

  const hasMoreGoals = filteredGoals.length > 3;

  return (
    <main className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      <div className="mb-4 sm:mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Goals</h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">Set targets and watch your progress climb month by month.</p>
        </div>
        <button 
          onClick={handleOpenModal}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm shadow hover:bg-indigo-700 transition"
        >
          <Plus className="h-4 w-4" />
          New Goal
        </button>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="px-3 sm:px-4 md:px-5 py-3 sm:py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h3 className="text-xs sm:text-sm font-semibold text-slate-700">
            {showAll ? "Goals" : "Recent Goals"}
            {searchQuery && (
              <span className="ml-2 text-xs text-slate-500 font-normal">
                ({filteredGoals.length} {filteredGoals.length === 1 ? 'result' : 'results'})
              </span>
            )}
          </h3>
          {hasMoreGoals && !searchQuery.trim() && (
            <button 
              onClick={() => setShowAll(!showAll)}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium self-start sm:self-auto"
            >
              {showAll ? "Show less" : `View all (${filteredGoals.length})`}
            </button>
          )}
        </div>
        {displayGoals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-5">
            {displayGoals.map((g) => {
          const pct = Math.round((g.saved / g.target) * 100);
          const remaining = Math.max(0, g.target - g.saved);
          const dueStr = new Date(g.due).toLocaleDateString();
          return (
            <div key={g.id} className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
                    <Target className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <h3 className="text-sm font-medium text-slate-900 truncate">{g.name}</h3>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700 whitespace-nowrap">{pct}%</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditGoal(g)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                      title="Edit goal"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(g.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Delete goal"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <GoalProgress saved={g.saved} target={g.target} />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 text-xs sm:text-sm text-slate-700">
                  <span>Saved ${g.saved.toLocaleString()} / ${g.target.toLocaleString()}</span>
                  <span className="inline-flex items-center gap-1 text-slate-600"><CalendarDays className="h-3.5 w-3.5 sm:h-4 sm:w-4" />{dueStr}</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  {remaining === 0 ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />Completed</span>
                  ) : (
                    <span className="text-slate-600">Remaining ${remaining.toLocaleString()}</span>
                  )}
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
                ? `No goals found matching "${searchQuery}"`
                : "No goals yet. Create your first goal to get started!"}
            </p>
          </div>
        )}
      </section>

      <AddGoalModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddGoal={handleAddGoal}
        onUpdateGoal={handleUpdateGoal}
        editingGoal={editingGoal}
      />
    </main>
  );
}
