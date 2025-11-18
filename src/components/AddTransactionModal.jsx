import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";

const categories = [
  "Groceries",
  "Dining",
  "Transport",
  "Shopping",
  "Entertainment",
  "Bills",
  "Income",
  "Other"
];

export default function AddTransactionModal({ isOpen, onClose, onAddTransaction, onUpdateTransaction, editingTransaction = null }) {
  const [merchant, setMerchant] = useState("");
  const [category, setCategory] = useState("Groceries");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState("expense"); // "expense" or "income"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditMode = editingTransaction !== null;

  // Populate form when editing
  useEffect(() => {
    if (editingTransaction) {
      setMerchant(editingTransaction.merchant || "");
      setCategory(editingTransaction.category || "Groceries");
      setAmount(Math.abs(editingTransaction.amount || 0).toString());
      setDate(editingTransaction.date || new Date().toISOString().split('T')[0]);
      setType(editingTransaction.amount >= 0 ? "income" : "expense");
    } else {
      // Reset form for new transaction
      setMerchant("");
      setCategory("Groceries");
      setAmount("");
      setDate(new Date().toISOString().split('T')[0]);
      setType("expense");
    }
    setError("");
  }, [editingTransaction, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!merchant.trim()) {
      setError("Please enter a merchant name");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (!date) {
      setError("Please select a date");
      return;
    }

    setLoading(true);

    try {
      // Create transaction object
      const transaction = {
        merchant: merchant.trim(),
        category,
        amount: type === "expense" ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount)),
        date,
      };

      if (isEditMode) {
        // Update existing transaction
        await onUpdateTransaction(editingTransaction.id, transaction);
      } else {
        // Add new transaction
        await onAddTransaction(transaction);
      }

      // Reset form
      setMerchant("");
      setAmount("");
      setCategory("Groceries");
      setDate(new Date().toISOString().split('T')[0]);
      setType("expense");
      setError("");

      // Close modal
      onClose();
    } catch (err) {
      setError(err.message || `Failed to ${isEditMode ? 'update' : 'add'} transaction`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setMerchant("");
      setAmount("");
      setCategory("Groceries");
      setDate(new Date().toISOString().split('T')[0]);
      setType("expense");
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
            {isEditMode ? "Edit Transaction" : "Add Transaction"}
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

          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Type
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType("expense")}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  type === "expense"
                    ? "bg-rose-100 text-rose-700 border-2 border-rose-300"
                    : "bg-slate-100 text-slate-700 border-2 border-transparent hover:bg-slate-200"
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setType("income")}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  type === "income"
                    ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-300"
                    : "bg-slate-100 text-slate-700 border-2 border-transparent hover:bg-slate-200"
                }`}
              >
                Income
              </button>
            </div>
          </div>

          {/* Merchant */}
          <div>
            <label htmlFor="merchant" className="block text-sm font-medium text-slate-700 mb-1.5">
              Merchant
            </label>
            <input
              id="merchant"
              type="text"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="e.g., Whole Foods"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1.5">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              disabled={loading}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1.5">
              Amount
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

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1.5">
              Date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={loading}
            />
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
                isEditMode ? "Update Transaction" : "Add Transaction"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

