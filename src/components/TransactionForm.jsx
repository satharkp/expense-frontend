import { useEffect, useState } from "react";
import api from "../api/axios";

export default function TransactionForm({
  onSuccess,
  editingTransaction,
  clearEdit
}) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [type, setType] = useState("expense");
  const [categories, setCategories] = useState([]);
  const [date, setDate] = useState("");

  // load categories
  useEffect(() => {
    api.get(`/categories?type=${type}`).then(res => {
      setCategories(res.data);
    });
  }, [type]);

  useEffect(() => {
    setCategoryId("");
  }, [type]);

  useEffect(() => {
    if (editingTransaction) {
      setAmount(editingTransaction.amount);
      setNote(editingTransaction.note || "");
      setCategoryId(editingTransaction.categoryId?._id || "");
      setType(editingTransaction.type);
      setDate(editingTransaction.date?.slice(0, 10));
    }
  }, [editingTransaction]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !categoryId || !type) {
      alert("Amount, category and type are required");
      return;
    }

    try {
      if (editingTransaction) {
        await api.put(`/transactions/${editingTransaction._id}`, {
          amount: Number(amount),
          categoryId,
          type,
          note,
          date
        });
      } else {
        await api.post("/transactions", {
          amount: Number(amount),
          categoryId,
          type,
          note,
          date
        });
      }

      // reset form
      setAmount("");
      setNote("");
      setCategoryId("");
      setType("expense");
      setDate("");
      if (clearEdit) clearEdit();

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to save transaction");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-sky-100 shadow-sm p-6 space-y-5"
    >
      <h3 className="text-lg font-semibold text-sky-700">
        {editingTransaction ? "Edit Transaction" : "Add Transaction"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        
        
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
            Amount
          </label>
          <input
            type="number"
            placeholder="₹ 0.00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-blue-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>

        
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
            Type
          </label>
          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-blue-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-blue-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>

        
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
            Category
          </label>
          <select
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-blue-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
            Note
          </label>
          <input
            placeholder="Optional note"
            value={note}
            onChange={e => setNote(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-blue-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition shadow-sm"
        >
          {editingTransaction ? "Update Transaction" : "Add Transaction"}
        </button>
      </div>
    </form>
  );
}