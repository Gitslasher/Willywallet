import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";

export default function AddGoalModal({ isOpen, onClose, onAddGoal, onUpdateGoal, editingGoal = null }) {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [saved, setSaved] = useState("");
  const [due, setDue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditMode = editingGoal !== null;

  // Populate form when editing
  useEffect(() => {
    if (editingGoal) {
      setName(editingGoal.name || "");
      setTarget((editingGoal.target || 0).toString());
      setSaved((editingGoal.saved || 0).toString());
      setDue(editingGoal.due || "");
    } else {
      // Reset form for new goal
      setName("");
      setTarget("");
      setSaved("0");
      // Set default due date to 1 year from now
      const defaultDate = new Date();
      defaultDate.setFullYear(defaultDate.getFullYear() + 1);
      setDue(defaultDate.toISOString().split('T')[0]);
    }
    setError("");
  }, [editingGoal, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!name.trim()) {
      setError("Please enter a goal name");
      return;
    }

    if (!target || parseFloat(target) <= 0) {
      setError("Please enter a valid target amount");
      return;
    }

    const savedAmount = saved === "" ? 0 : parseFloat(saved);
    if (isNaN(savedAmount) || savedAmount < 0) {
      setError("Please enter a valid saved amount");
      return;
    }

    if (savedAmount > parseFloat(target)) {
      setError("Saved amount cannot exceed target amount");
      return;
    }

    if (!due) {
      setError("Please select a due date");
      return;
    }

    setLoading(true);

    try {
      // Create goal object
      const goal = {
        name: name.trim(),
        target: parseFloat(target),
        saved: savedAmount,
        due,
      };

      if (isEditMode) {
        // Update existing goal
        await onUpdateGoal(editingGoal.id, goal);
      } else {
        // Add new goal
        await onAddGoal(goal);
      }

      // Reset form
      setName("");
      setTarget("");
      setSaved("0");
      const defaultDate = new Date();
      defaultDate.setFullYear(defaultDate.getFullYear() + 1);
      setDue(defaultDate.toISOString().split('T')[0]);
      setError("");

      // Close modal
      onClose();
    } catch (err) {
      setError(err.message || `Failed to ${isEditMode ? 'update' : 'add'} goal`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setName("");
      setTarget("");
      setSaved("0");
      const defaultDate = new Date();
      defaultDate.setFullYear(defaultDate.getFullYear() + 1);
      setDue(defaultDate.toISOString().split('T')[0]);
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
            {isEditMode ? "Edit Goal" : "New Goal"}
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

          {/* Goal Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
              Goal Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Emergency Fund, Vacation"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Target Amount */}
          <div>
            <label htmlFor="target" className="block text-sm font-medium text-slate-700 mb-1.5">
              Target Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
              <input
                id="target"
                type="number"
                step="0.01"
                min="0"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
          </div>

          {/* Saved Amount */}
          <div>
            <label htmlFor="saved" className="block text-sm font-medium text-slate-700 mb-1.5">
              Amount Saved
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
              <input
                id="saved"
                type="number"
                step="0.01"
                min="0"
                value={saved}
                onChange={(e) => setSaved(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {isEditMode ? "Update how much you've saved toward this goal" : "Set initial amount saved (optional)"}
            </p>
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor="due" className="block text-sm font-medium text-slate-700 mb-1.5">
              Due Date
            </label>
            <input
              id="due"
              type="date"
              value={due}
              onChange={(e) => setDue(e.target.value)}
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
                isEditMode ? "Update Goal" : "Add Goal"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

