import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function SummaryCards() {
  const cards = [
    {
      title: "Net Worth",
      value: "$128,450",
      change: "+2.3%",
      positive: true,
    },
    {
      title: "Cash Flow (30d)",
      value: "+$3,240",
      change: "+6.1%",
      positive: true,
    },
    {
      title: "Monthly Spend",
      value: "$4,120",
      change: "-3.8%",
      positive: false,
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((c) => (
        <div
          key={c.title}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500">{c.title}</h3>
            <span
              className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                c.positive
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-700"
              }`}
            >
              {c.positive ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              {c.change}
            </span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{c.value}</p>
        </div>
      ))}
    </section>
  );
}
