import { CheckCircle2 } from "lucide-react";

export default function MarketingAside() {
  const benefits = [
    "Unified view of accounts",
    "Smart budgets & alerts",
    "Set and track goals",
    "Private by design"
  ];

  return (
    <aside className="hidden lg:block w-full max-w-md">
      <div className="relative h-full rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-500 p-8 text-white overflow-hidden shadow-xl">
        <div className="relative z-10">
          <h2 className="text-3xl font-semibold leading-tight">Master your money</h2>
          <p className="mt-2 text-indigo-50">
            Stay on top of spending, build better habits, and hit your goals with a dashboard designed for clarity.
          </p>

          <ul className="mt-6 space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 mt-0.5" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pointer-events-none absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      </div>
    </aside>
  );
}
