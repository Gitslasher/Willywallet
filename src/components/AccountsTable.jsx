import { Banknote, CreditCard, PiggyBank } from "lucide-react";

const accounts = [
  { id: 1, name: "Chase Checking", type: "Checking", balance: 3540.23, icon: Banknote },
  { id: 2, name: "Amex Gold", type: "Credit Card", balance: -1240.12, icon: CreditCard },
  { id: 3, name: "Ally Savings", type: "Savings", balance: 18240.19, icon: PiggyBank },
];

export default function AccountsTable({ searchQuery = "" }) {
  // Filter accounts based on search query
  const filteredAccounts = accounts.filter((acc) => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      acc.name.toLowerCase().includes(query) ||
      acc.type.toLowerCase().includes(query) ||
      Math.abs(acc.balance).toString().includes(query)
    );
  });

  return (
    <section className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-3 sm:px-4 md:px-5 py-3 sm:py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h3 className="text-xs sm:text-sm font-semibold text-slate-700">
          Accounts
          {searchQuery && (
            <span className="ml-2 text-xs text-slate-500 font-normal">
              ({filteredAccounts.length} {filteredAccounts.length === 1 ? 'result' : 'results'})
            </span>
          )}
        </h3>
        <span className="text-xs text-slate-500 self-start sm:self-auto">Linked: {accounts.length}</span>
      </div>
      {filteredAccounts.length > 0 ? (
        <div className="divide-y divide-slate-200">
          {filteredAccounts.map((acc) => (
          <div key={acc.id} className="px-3 sm:px-4 md:px-5 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-3 hover:bg-slate-50">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                <acc.icon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-slate-900 truncate">{acc.name}</p>
                <p className="text-xs text-slate-500 truncate">{acc.type}</p>
              </div>
            </div>
            <div className={`text-xs sm:text-sm font-semibold flex-shrink-0 ${acc.balance < 0 ? "text-rose-600" : "text-slate-900"}`}>
              {acc.balance < 0 ? "-" : ""}${Math.abs(acc.balance).toLocaleString()}
            </div>
          </div>
          ))}
        </div>
      ) : (
        <div className="px-3 sm:px-4 md:px-5 py-6 sm:py-8 text-center">
          <p className="text-xs sm:text-sm text-slate-500">No accounts found matching "{searchQuery}"</p>
        </div>
      )}
    </section>
  );
}
