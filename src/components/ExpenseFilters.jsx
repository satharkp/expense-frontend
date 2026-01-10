import { useEffect, useState } from "react";
import api from "../api/axios";

export default function ExpenseFilters({ onFilter }) {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState("latest");

  useEffect(() => {
    api.get("/categories").then(res => {
      setCategories(res.data);
    });
  }, []);

  const applyFilters = () => {
    onFilter({ categoryId, from, to, sort });
  };
    const clearFilters = () => {
  setCategoryId("");
  setFrom("");
  setTo("");
  setSort("latest");
  onFilter({}, 1);
};

  return (
    <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-6 space-y-5 ">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-sky-700">
          Filters
        </h3>

        <button
          type="button"
          onClick={clearFilters}
          className="text-sm font-medium text-sky-600 bg-white border border-blue-400 hover:border-blue-200"
        >
          Clear
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        
        {/* Category */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
            Category
          </label>
          <select
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
          >
            <option value="">All categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* From date */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
            From
          </label>
          <input
            type="date"
            value={from}
            onChange={e => setFrom(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>

        {/* To date */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
            To
          </label>
          <input
            type="date"
            value={to}
            onChange={e => setTo(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>

        {/* Sort */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
            Sort
          </label>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
          >
            <option value="latest">Latest first</option>
            <option value="oldest">Oldest first</option>
            <option value="amountDesc">Amount: High → Low</option>
            <option value="amountAsc">Amount: Low → High</option>
          </select>
        </div>

        {/* Actions */}
        <div>
          <button
            onClick={applyFilters}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold py-2.5 rounded-xl transition shadow-sm"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}