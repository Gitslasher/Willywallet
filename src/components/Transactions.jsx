import { useState, useEffect, useRef } from "react";
import { ArrowDownRight, ArrowUpRight, Plus, Search, Filter, ChevronRight, Trash2 } from "lucide-react";

const defaultFilters = {
  type: "all",
  category: "all",
};

const defaultDateFilter = {
  start: "",
  end: "",
};

export default function Transactions({ searchQuery = "", transactions = [], onEditTransaction, onDeleteTransaction, onAddTransaction }) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState(() => ({ ...defaultFilters }));
  const [draftFilters, setDraftFilters] = useState(() => ({ ...defaultFilters }));
  const [dateFilter, setDateFilter] = useState(() => ({ ...defaultDateFilter }));
  const [draftDateFilter, setDraftDateFilter] = useState(() => ({ ...defaultDateFilter }));
  const filterContainerRef = useRef(null);

  const uniqueCategories = Array.from(new Set(transactions.map((t) => t.category))).filter(Boolean);

  // Sync with parent search query
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const startBoundary = dateFilter.start ? new Date(dateFilter.start) : null;
  const endBoundary = dateFilter.end ? new Date(dateFilter.end) : null;
  if (endBoundary) {
    endBoundary.setHours(23, 59, 59, 999);
  }

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter((t) => {
    if (!localSearchQuery.trim()) return true;
    
    const query = localSearchQuery.toLowerCase();
    return (
      t.merchant.toLowerCase().includes(query) ||
      t.category.toLowerCase().includes(query) ||
      Math.abs(t.amount).toString().includes(query)
    );
  }).filter((t) => {
    if (filters.type === "income" && t.amount <= 0) {
      return false;
    }
    if (filters.type === "expense" && t.amount >= 0) {
      return false;
    }
    if (filters.category !== "all" && t.category !== filters.category) {
      return false;
    }
    const transactionDate = new Date(t.date);
    if (startBoundary && transactionDate < startBoundary) {
      return false;
    }
    if (endBoundary && transactionDate > endBoundary) {
      return false;
    }
    return true;
  });

  // Sort transactions by date (most recent first)
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  const handleDraftFilterChange = (key, value) => {
    setDraftFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetDraftFilters = () => {
    setDraftFilters({ ...defaultFilters });
  };

  const applyFilters = () => {
    setFilters({ ...draftFilters });
  setDateFilter({ ...draftDateFilter });
    setIsFilterOpen(false);
  };

  const hasActiveTypeFilter = filters.type !== defaultFilters.type;
  const hasActiveCategoryFilter = filters.category !== defaultFilters.category;
  const hasActiveDateFilter = Boolean(dateFilter.start || dateFilter.end);
  const hasActiveFilters = hasActiveTypeFilter || hasActiveCategoryFilter || hasActiveDateFilter;
  const activeFiltersCount = [hasActiveTypeFilter, hasActiveCategoryFilter, hasActiveDateFilter].filter(Boolean).length;

  useEffect(() => {
    if (isFilterOpen) {
      setDraftFilters({ ...filters });
    setDraftDateFilter({ ...dateFilter });
    }
}, [isFilterOpen, filters, dateFilter]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterContainerRef.current && !filterContainerRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);

  const resetDraftDateFilter = () => {
    setDraftDateFilter({ ...defaultDateFilter });
  };

  // Group transactions by date
  const groupedTransactions = sortedTransactions.reduce((groups, transaction) => {
    const date = new Date(transaction.date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});

  // Calculate subtotal for each date
  const getSubtotal = (transactions) => {
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    return total;
  };

  // Format account name (default if not present)
  const getAccountName = (transaction) => {
    return transaction.account || (transaction.amount < 0 ? "Joint Credit Card" : "SoFi Checking");
  };

  return (
    <main className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      {/* Header Bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Transactions</h1>
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Bar */}
          <div className="relative flex-1 sm:flex-initial min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Q Search"
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
          </div>
          {/* Action Buttons */}
          <div className="relative" ref={filterContainerRef}>
            <button
              onClick={() => setIsFilterOpen((prev) => !prev)}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${
                isFilterOpen || hasActiveFilters
                  ? "border-indigo-500 text-indigo-600 bg-indigo-50"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
            <Filter className="h-4 w-4" />
            Filters
              {hasActiveFilters && (
                <span className="ml-1 text-xs bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            {isFilterOpen && (
              <div className="absolute right-0 z-20 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-lg p-4 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-2">Transaction type</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "All", value: "all" },
                      { label: "Income", value: "income" },
                      { label: "Expense", value: "expense" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleDraftFilterChange("type", option.value)}
                        className={`px-3 py-2 text-xs rounded-lg border ${
                          draftFilters.type === option.value
                            ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-2">Category</p>
                  <select
                    value={draftFilters.category}
                    onChange={(e) => handleDraftFilterChange("category", e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All categories</option>
                    {uniqueCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="border-t border-slate-100 pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-slate-500">Date range</p>
                    {draftDateFilter.start || draftDateFilter.end ? (
                      <button
                        onClick={resetDraftDateFilter}
                        className="text-[11px] font-semibold text-slate-400 hover:text-slate-600"
                      >
                        Clear dates
                      </button>
                    ) : null}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[11px] text-slate-400 mb-1">Start</p>
                      <input
                        type="date"
                        value={draftDateFilter.start}
                        onChange={(e) =>
                          setDraftDateFilter((prev) => ({ ...prev, start: e.target.value }))
                        }
                        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 mb-1">End</p>
                      <input
                        type="date"
                        value={draftDateFilter.end}
                        onChange={(e) =>
                          setDraftDateFilter((prev) => ({ ...prev, end: e.target.value }))
                        }
                        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      resetDraftFilters();
                      resetDraftDateFilter();
                    }}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                  >
                    Clear filters
                  </button>
                  <button
                    onClick={applyFilters}
                    className="px-3 py-2 text-xs rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition"
                  >
                    Apply filters
          </button>
                </div>
              </div>
            )}
          </div>
          <button className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50">
            Edit rules
          </button>
          {onAddTransaction && (
            <button 
              onClick={onAddTransaction}
              className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm shadow hover:bg-orange-600 transition"
            >
              <Plus className="h-4 w-4" />
              Add transaction
            </button>
          )}
        </div>
      </div>

      {/* Transaction List */}
      {Object.keys(groupedTransactions).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedTransactions).map(([date, dateTransactions]) => {
            const subtotal = getSubtotal(dateTransactions);
            return (
              <div key={date} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Date Header with Subtotal */}
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900">{date}</h3>
                    <span className={`text-sm font-semibold ${subtotal >= 0 ? "text-emerald-700" : "text-slate-900"}`}>
                      {subtotal >= 0 ? "+" : ""}${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
                
                {/* Transactions for this date */}
                <ul className="divide-y divide-slate-200">
                  {dateTransactions.map((t) => (
                    <li 
                      key={t.id} 
                      className="px-4 py-3 flex items-center justify-between hover:bg-slate-50 group"
                    >
                      <div 
                        className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                        onClick={() => onEditTransaction && onEditTransaction(t)}
                      >
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          t.amount < 0 ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                        }`}>
                          {t.amount < 0 ? (
                            <ArrowDownRight className="h-5 w-5" />
                          ) : (
                            <ArrowUpRight className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{t.merchant}</p>
                          <p className="text-xs text-slate-500 truncate">
                            {t.category} • {getAccountName(t)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className={`text-sm font-semibold ${t.amount < 0 ? "text-slate-900" : "text-emerald-700"}`}>
                          {t.amount >= 0 ? "+" : ""}${Math.abs(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="flex items-center gap-1">
                          {onDeleteTransaction && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Are you sure you want to delete the transaction "${t.merchant}"?`)) {
                                  onDeleteTransaction(t.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Delete transaction"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                          <ChevronRight className="h-5 w-5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" 
                            onClick={() => onEditTransaction && onEditTransaction(t)}
                          />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
          <p className="text-sm text-slate-500">
            {localSearchQuery.trim() 
              ? `No transactions found matching "${localSearchQuery}"`
              : "No transactions yet. Add your first transaction to get started!"}
          </p>
        </div>
      )}
    </main>
  );
}
