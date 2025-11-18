import { Settings as SettingsIcon, Bell } from "lucide-react";

export default function Settings() {
  return (
    <main className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="text-slate-600 text-sm sm:text-base mt-1">
          Manage your app preferences and notification settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Preferences */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <SettingsIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <h2 className="font-medium text-sm sm:text-base text-slate-900">Preferences</h2>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-900">Currency</p>
                <p className="text-xs text-slate-600">Primary currency for budgets</p>
              </div>
              <select className="rounded-lg border border-slate-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm w-full sm:w-auto">
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
              </select>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-100 pt-4">
              <div>
                <p className="text-sm font-medium text-slate-900">Language</p>
                <p className="text-xs text-slate-600">Choose your display language</p>
              </div>
              <select className="rounded-lg border border-slate-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm w-full sm:w-auto">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <h2 className="font-medium text-sm sm:text-base text-slate-900">Notifications</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: "Budget limit alerts", desc: "Get notified when nearing limits" },
              { label: "New transaction summaries", desc: "Weekly summaries sent to your inbox" },
              { label: "Goal milestones", desc: "Celebrate progress automatically" },
            ].map((n) => (
              <label key={n.label} className="flex items-start gap-3">
                <input type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300" defaultChecked />
                <div>
                  <p className="text-sm font-medium text-slate-900">{n.label}</p>
                  <p className="text-xs text-slate-600">{n.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
