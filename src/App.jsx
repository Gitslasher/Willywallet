import { useState, useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import AuthHeader from "./components/AuthHeader";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import MarketingAside from "./components/MarketingAside";
import Sidebar from "./components/Sidebar";
import Overview from "./components/Overview";
import Transactions from "./components/Transactions";
import Budgets from "./components/Budgets";
import Goals from "./components/Goals";
import Chatbot from "./components/Chatbot";
import Settings from "./components/Settings";
import Profile from "./components/Profile";
import AddTransactionModal from "./components/AddTransactionModal";

// Initial transactions data
const initialTransactions = [
  { id: 1, merchant: "Whole Foods", category: "Groceries", amount: -86.45, date: "2025-11-02" },
  { id: 2, merchant: "Starbucks", category: "Dining", amount: -5.75, date: "2025-11-02" },
  { id: 3, merchant: "Payroll", category: "Income", amount: 2950.0, date: "2025-11-01" },
  { id: 4, merchant: "Lyft", category: "Transport", amount: -18.2, date: "2025-10-31" },
];

// LocalStorage key for transactions
const TRANSACTIONS_STORAGE_KEY = "monarch_transactions";

// Load transactions from localStorage
const loadTransactionsFromStorage = () => {
  try {
    const stored = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate that it's an array
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Error loading transactions from localStorage:", error);
  }
  return initialTransactions;
};

// Save transactions to localStorage
const saveTransactionsToStorage = (transactions) => {
  try {
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error("Error saving transactions to localStorage:", error);
  }
};

export default function App() {
  // App-level state
  const [authMode, setAuthMode] = useState("login"); // 'login' | 'signup'
  const [tab, setTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [transactions, setTransactions] = useState(() => loadTransactionsFromStorage());
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const { user, loading } = useAuth();

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (user && !loading) {
      saveTransactionsToStorage(transactions);
    }
  }, [transactions, user, loading]);

  // Check if user is authenticated
  useEffect(() => {
    if (user && !loading) {
      // User is logged in, app will show dashboard
      // Reload transactions from storage when user logs in
      const storedTransactions = loadTransactionsFromStorage();
      setTransactions(storedTransactions);
    }
  }, [user, loading]);

  const onLoginSuccess = () => {
    // This will be handled by the auth state change
  };

  const handleAddTransaction = (newTransaction) => {
    // Generate a new ID (simple increment from max ID)
    const maxId = transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) : 0;
    const transactionWithId = {
      ...newTransaction,
      id: maxId + 1,
    };
    
    // Add new transaction at the beginning of the array
    setTransactions([transactionWithId, ...transactions]);
  };

  const handleUpdateTransaction = (id, updatedTransaction) => {
    // Update the transaction with the given ID
    setTransactions(transactions.map(t => 
      t.id === id ? { ...updatedTransaction, id } : t
    ));
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setIsAddTransactionModalOpen(true);
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleCloseModal = () => {
    setIsAddTransactionModalOpen(false);
    setEditingTransaction(null);
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show auth UI
  if (!user) {

    // Render auth layout
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
        <div className="mx-auto max-w-6xl px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
            <div className="flex items-center">
              <div className="w-full">
                <AuthHeader />

                <div className="mt-6 sm:mt-8 rounded-2xl border bg-white/70 backdrop-blur shadow-sm p-4 sm:p-6">
                  {authMode === "login" ? (
                    <LoginForm onSuccess={onLoginSuccess} />
                  ) : (
                    <SignupForm onSuccess={onLoginSuccess} />
                  )}

                  <div className="mt-6 text-center text-sm text-muted-foreground">
                    {authMode === "login" ? (
                      <>
                        Don&apos;t have an account? {" "}
                        <button
                          className="text-indigo-600 hover:text-indigo-700 font-medium"
                          onClick={() => setAuthMode("signup")}
                        >
                          Create one
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account? {" "}
                        <button
                          className="text-indigo-600 hover:text-indigo-700 font-medium"
                          onClick={() => setAuthMode("login")}
                        >
                          Sign in
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-6 text-center text-xs text-gray-500">
                  By continuing you agree to our <button className="underline">Terms</button> and <button className="underline">Privacy Policy</button>.
                </div>
              </div>
            </div>

            <MarketingAside />
          </div>
        </div>
      </div>
    );
  }

  // App dashboard UI
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      <Sidebar 
        currentPage={tab}
        onNavigate={setTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenSettings={() => setTab("settings")}
      />
      <div className="flex-1 ml-64 overflow-x-hidden">
        {tab === "overview" && (
          <Overview 
            searchQuery={searchQuery} 
            transactions={transactions}
            onEditTransaction={handleEditTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onNavigateToTransactions={() => setTab("transactions")}
          />
        )}
        {tab === "transactions" && (
          <Transactions 
            searchQuery={searchQuery} 
            transactions={transactions}
            onEditTransaction={handleEditTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onAddTransaction={() => {
              setEditingTransaction(null);
              setIsAddTransactionModalOpen(true);
            }}
          />
        )}
        {tab === "budgets" && <Budgets searchQuery={searchQuery} />}
        {tab === "goals" && <Goals searchQuery={searchQuery} />}
        {tab === "accounts" && (
          <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Accounts</h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">Manage your accounts</p>
          </div>
        )}
        {tab === "cashflow" && (
          <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Cash Flow</h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">View your cash flow analysis</p>
          </div>
        )}
        {tab === "reports" && (
          <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Reports</h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">View financial reports</p>
          </div>
        )}
        {tab === "recurring" && (
          <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Recurring</h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">Manage recurring transactions</p>
          </div>
        )}
        {tab === "investments" && (
          <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Investments</h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">Track your investments</p>
          </div>
        )}
        {tab === "chat" && (
          <Chatbot 
            transactions={transactions}
          />
        )}
        {tab === "profile" && <Profile />}
        {tab === "settings" && <Settings />}
      </div>
      <AddTransactionModal
        isOpen={isAddTransactionModalOpen}
        onClose={handleCloseModal}
        onAddTransaction={handleAddTransaction}
        onUpdateTransaction={handleUpdateTransaction}
        editingTransaction={editingTransaction}
      />
    </div>
  );
}
