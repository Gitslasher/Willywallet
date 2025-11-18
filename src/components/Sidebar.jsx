import { useState, useEffect } from "react";
import { Home, Wallet, Receipt, TrendingUp, FileText, WalletCards, Repeat, Target, TrendingDown, Bot, Search, Bell, Settings, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Sidebar({ currentPage, onNavigate, searchQuery, onSearchChange, onOpenSettings }) {
  const { user } = useAuth();
  const [userName, setUserName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Keep search open if there's a query
  useEffect(() => {
    if (searchQuery.trim() && !isSearchOpen) {
      setIsSearchOpen(true);
    }
  }, [searchQuery, isSearchOpen]);

  // Load user name and profile picture from localStorage or user metadata
  useEffect(() => {
    const loadUserProfile = () => {
      let firstName = "";
      let lastName = "";
      let picture = "";

      // Try to get from user metadata first
      if (user?.user_metadata) {
        firstName = user.user_metadata.first_name || "";
        lastName = user.user_metadata.last_name || "";
      }

      // Also try loading from localStorage as fallback or override
      const savedProfile = localStorage.getItem("user_profile");
      if (savedProfile) {
        try {
          const profile = JSON.parse(savedProfile);
          if (profile.firstName) firstName = profile.firstName;
          if (profile.lastName) lastName = profile.lastName;
          if (profile.profilePicture) picture = profile.profilePicture;
        } catch (error) {
          console.error("Error loading profile from localStorage:", error);
        }
      }

      // Combine first and last name, or use default
      if (firstName || lastName) {
        setUserName(`${firstName} ${lastName}`.trim());
      } else {
        setUserName("there");
      }
      
      setProfilePicture(picture);
    };

    loadUserProfile();

    // Listen for custom events (when user updates profile in Settings)
    const handleCustomStorageChange = () => {
      loadUserProfile();
    };
    window.addEventListener("userProfileUpdated", handleCustomStorageChange);

    return () => {
      window.removeEventListener("userProfileUpdated", handleCustomStorageChange);
    };
  }, [user]);
  const handleProfileClick = () => {
    onNavigate("profile");
    setIsSearchOpen(false);
  };

  const menuItems = [
    { key: "overview", label: "Dashboard", icon: Home },
    { key: "accounts", label: "Accounts", icon: Wallet },
    { key: "transactions", label: "Transactions", icon: Receipt },
    { key: "cashflow", label: "Cash Flow", icon: TrendingUp },
    { key: "reports", label: "Reports", icon: FileText },
    { key: "budgets", label: "Budget", icon: WalletCards },
    { key: "recurring", label: "Recurring", icon: Repeat, badge: 8 },
    { key: "goals", label: "Goals", icon: Target },
    { key: "investments", label: "Investments", icon: TrendingDown },
    { key: "chat", label: "AI Financial Advisor", icon: Bot },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col z-30 overflow-hidden">
      {/* Logo and Top Icons */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4 gap-3">
          <button
            type="button"
            onClick={handleProfileClick}
            className="flex items-center gap-3 px-2 py-1 rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            aria-label="Open profile"
          >
            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-slate-200 bg-slate-100 flex items-center justify-center flex-shrink-0">
              {profilePicture ? (
                <img 
                  src={profilePicture} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-slate-400" />
              )}
            </div>
            <div className="text-left">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">Profile</p>
              <p className="text-sm font-semibold text-slate-900 line-clamp-1">
                {userName ? userName : "View profile"}
              </p>
            </div>
          </button>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 ${isSearchOpen ? 'bg-slate-100' : ''}`}
              title="Search"
            >
              <Search className="h-4 w-4" />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            <button onClick={onOpenSettings} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
        {!isSearchOpen && (
          <button
            type="button"
            onClick={handleProfileClick}
            className="text-sm font-medium text-slate-900 text-left w-full hover:text-indigo-600 transition"
          >
            Welcome back, {userName}!
          </button>
        )}
        {isSearchOpen && (
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search budgets, transactions, goals, accounts..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setIsSearchOpen(false);
                  onSearchChange('');
                }
              }}
              onBlur={() => {
                // Keep search open if there's a query, close if empty
                if (!searchQuery.trim()) {
                  setIsSearchOpen(false);
                }
              }}
              autoFocus
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.key;
            return (
              <li key={item.key}>
                <button
                  onClick={() => onNavigate(item.key)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

    </aside>
  );
}



