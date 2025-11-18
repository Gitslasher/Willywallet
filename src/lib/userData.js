// Utility functions to load user data from localStorage

const TRANSACTIONS_STORAGE_KEY = "monarch_transactions";
const BUDGETS_STORAGE_KEY = "monarch_budgets";
const GOALS_STORAGE_KEY = "monarch_goals";

export const loadTransactions = () => {
  try {
    const stored = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Error loading transactions:", error);
  }
  return [];
};

export const loadBudgets = () => {
  try {
    const stored = localStorage.getItem(BUDGETS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Error loading budgets:", error);
  }
  return [];
};

export const loadGoals = () => {
  try {
    const stored = localStorage.getItem(GOALS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Error loading goals:", error);
  }
  return [];
};

export const getUserDataSummary = () => {
  const transactions = loadTransactions();
  const budgets = loadBudgets();
  const goals = loadGoals();

  // Calculate summary statistics
  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = Math.abs(
    transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const netWorth = totalIncome - totalExpenses;

  const budgetSummary = budgets.map(b => ({
    name: b.name,
    budget: b.amount,
    spent: b.spent,
    remaining: Math.max(0, b.amount - b.spent),
    percentage: Math.round((b.spent / b.amount) * 100),
    overBudget: b.spent > b.amount
  }));

  const goalsSummary = goals.map(g => ({
    name: g.name,
    target: g.target,
    saved: g.saved,
    remaining: Math.max(0, g.target - g.saved),
    percentage: Math.round((g.saved / g.target) * 100),
    dueDate: g.due
  }));

  return {
    transactions,
    budgets: budgetSummary,
    goals: goalsSummary,
    summary: {
      totalIncome,
      totalExpenses,
      netWorth,
      transactionCount: transactions.length
    }
  };
};



