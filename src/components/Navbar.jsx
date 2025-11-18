import { Wallet, Search, Settings, MessageCircle } from "lucide-react";

export default function Navbar({ onOpenChat, onOpenSettings, searchQuery, onSearchChange }) {
  return (
    <header className="sticky top-0 z-20 bg-white/70 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
            <Wallet className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <span className="font-semibold text-slate-900 text-base sm:text-lg tracking-tight truncate">Monarch Money</span>
        </div>

        {/* Desktop & Tablet */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search budgets, transactions, goals, accounts..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm w-64 lg:w-72"
            />
          </div>
          <button onClick={onOpenChat} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50" title="AI Chat">
            <MessageCircle className="h-4 w-4 text-slate-600" />
          </button>
          <button onClick={onOpenSettings} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50" title="Settings">
            <Settings className="h-4 w-4 text-slate-600" />
          </button>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-1.5 flex-shrink-0">
          <button onClick={onOpenChat} className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50" title="Chat">
            <MessageCircle className="h-4 w-4" />
          </button>
          <button onClick={onOpenSettings} className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50" title="Settings">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Mobile Search Bar */}
      <div className="md:hidden px-3 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search budgets, transactions, goals, accounts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
          />
        </div>
      </div>
    </header>
  );
}
