import { Home, Target, WalletCards, Receipt } from "lucide-react";

export default function Tabs({ current, onChange }) {
  const items = [
    { key: "overview", label: "Overview", icon: Home },
    { key: "transactions", label: "Transactions", icon: Receipt },
    { key: "budgets", label: "Budgets", icon: WalletCards },
    { key: "goals", label: "Goals", icon: Target },
  ];

  return (
    <nav className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 mt-3 sm:mt-4">
      <div className="flex items-center gap-1 sm:gap-2 bg-white/80 backdrop-blur rounded-xl p-1 border border-slate-200 shadow-sm overflow-x-auto scrollbar-hide">
        {items.map((it) => {
          const ActiveIcon = it.icon;
          const active = current === it.key;
          return (
            <button
              key={it.key}
              onClick={() => onChange(it.key)}
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition whitespace-nowrap flex-shrink-0 ${
                active ? "bg-indigo-600 text-white" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <ActiveIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>{it.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
