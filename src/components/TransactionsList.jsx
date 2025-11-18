import { useState, useEffect } from "react";
import { ArrowDownRight, ArrowUpRight, BadgeDollarSign, Pencil, Trash2 } from "lucide-react";

export default function TransactionsList({ searchQuery = "", transactions = [], onEditTransaction, onDeleteTransaction }) {
  const [showAll, setShowAll] = useState(false);

  // Reset showAll when search query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      setShowAll(false);
    }
  }, [searchQuery]);

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter((t) => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      t.merchant.toLowerCase().includes(query) ||
      t.category.toLowerCase().includes(query) ||
      Math.abs(t.amount).toString().includes(query)
    );
  });

  // Sort transactions by date (most recent first)
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  // Limit to 3 transactions if not showing all
  const displayTransactions = showAll || searchQuery.trim() 
    ? sortedTransactions 
    : sortedTransactions.slice(0, 3);

  const hasMoreTransactions = sortedTransactions.length > 3;

  return (
    <section className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-3 sm:px-4 md:px-5 py-3 sm:py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h3 className="text-xs sm:text-sm font-semibold text-slate-700">
          {showAll ? "Transactions" : "Recent Transactions"}
          {searchQuery && (
            <span className="ml-2 text-xs text-slate-500 font-normal">
              ({filteredTransactions.length} {filteredTransactions.length === 1 ? 'result' : 'results'})
            </span>
          )}
        </h3>
        {hasMoreTransactions && !searchQuery.trim() && (
          <button 
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium self-start sm:self-auto"
          >
            {showAll ? "Show less" : `View all (${sortedTransactions.length})`}
          </button>
        )}
      </div>
      {displayTransactions.length > 0 ? (
        <ul className="divide-y divide-slate-200">
          {displayTransactions.map((t) => (
          <li key={t.id} className="px-3 sm:px-4 md:px-5 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-3 hover:bg-slate-50 group">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                t.amount < 0 ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
              }`}>
                {t.amount < 0 ? (
                  <ArrowDownRight className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-slate-900 truncate">{t.merchant}</p>
                <p className="text-xs text-slate-500 truncate">{t.category} • {new Date(t.date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <div className={`text-xs sm:text-sm font-semibold ${t.amount < 0 ? "text-rose-600" : "text-emerald-700"}`}>
                {t.amount < 0 ? "-" : "+"}${Math.abs(t.amount).toLocaleString()}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onEditTransaction && (
                  <button
                    onClick={() => onEditTransaction(t)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                    title="Edit transaction"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                )}
                {onDeleteTransaction && (
                  <button
                    onClick={() => onDeleteTransaction(t.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    title="Delete transaction"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </li>
          ))}
        </ul>
      ) : (
        <div className="px-3 sm:px-4 md:px-5 py-6 sm:py-8 text-center">
          <p className="text-xs sm:text-sm text-slate-500">No transactions found matching "{searchQuery}"</p>
        </div>
      )}
      <div className="px-3 sm:px-4 md:px-5 py-2 sm:py-3 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <BadgeDollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Smart categorization enabled
        </div>
        <button className="text-xs text-slate-600 hover:text-slate-800 self-start sm:self-auto">Manage rules</button>
      </div>
    </section>
  );
}
