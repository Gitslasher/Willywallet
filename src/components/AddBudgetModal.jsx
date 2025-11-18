import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";

const categories = [
  "Groceries",
  "Dining",
  "Transport",
  "Shopping",
  "Entertainment",
  "Bills",
  "Other"
];

const colors = [
  { name: "Emerald", value: "bg-emerald-500" },
  { name: "Indigo", value: "bg-indigo-500" },
  { name: "Amber", value: "bg-amber-500" },
  { name: "Rose", value: "bg-rose-500" },
  { name: "Blue", value: "bg-blue-500" },
  { name: "Purple", value: "bg-purple-500" },
  { name: "Teal", value: "bg-teal-500" },
  { name: "Orange", value: "bg-orange-500" },
];

export default function AddBudgetModal({ isOpen, onClose, onAddBudget, onUpdateBudget, editingBudget = null }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [spent, setSpent] = useState("");
  const [color, setColor] = useState("bg-emerald-500");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditMode = editingBudget !== null;

  // Populate form when editing
  useEffect(() => {
    if (editingBudget) {
      setName(editingBudget.name || "");
      setAmount((editingBudget.amount || 0).toString());
      setSpent((editingBudget.spent || 0).toString());
      setColor(editingBudget.color || "bg-emerald-500");
    } else {
      // Reset form for new budget
      setName("");
      setAmount("");
      setSpent("0");
      setColor("bg-emerald-500");
    }
    setError("");
  }, [editingBudget, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!name.trim()) {
      setError("Please enter a budget name");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    const spentAmount = spent === "" ? 0 : parseFloat(spent);
    if (isNaN(spentAmount) || spentAmount < 0) {
      setError("Please enter a valid spent amount");
      return;
    }

    setLoading(true);

    try {
      // Create budget object
      const budget = {
        name: name.trim(),
        amount: parseFloat(amount),
        color,
        spent: spentAmount,
      };

      if (isEditMode) {
        // Update existing budget
        await onUpdateBudget(editingBudget.id, budget);
      } else {
        // Add new budget
        await onAddBudget(budget);
      }

      // Reset form
      setName("");
      setAmount("");
      setSpent("0");
      setColor("bg-emerald-500");
      setError("");

      // Close modal
      onClose();
    } catch (err) {
      setError(err.message || `Failed to ${isEditMode ? 'update' : 'add'} budget`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setName("");
      setAmount("");
      setSpent("0");
      setColor("bg-emerald-500");
      setError("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            {isEditMode ? "Edit Budget" : "New Budget"}
          </h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Budget Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
              Budget Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Groceries, Dining"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1.5">
              Monthly Budget Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
          </div>

          {/* Spent Amount */}
          <div>
            <label htmlFor="spent" className="block text-sm font-medium text-slate-700 mb-1.5">
              Amount Spent
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
              <input
                id="spent"
                type="number"
                step="0.01"
                min="0"
                value={spent}
                onChange={(e) => setSpent(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {isEditMode ? "Update how much you've spent on this budget" : "Set initial amount spent (optional)"}
            </p>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Color
            </label>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  disabled={loading}
                  className={`h-10 rounded-lg ${c.value} transition-all ${
                    color === c.value
                      ? "ring-2 ring-offset-2 ring-indigo-500 scale-105"
                      : "hover:opacity-80"
                  }`}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium transition disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isEditMode ? "Updating..." : "Adding..."}
                </>
              ) : (
                isEditMode ? "Update Budget" : "Add Budget"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

