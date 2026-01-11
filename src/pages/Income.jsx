import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import ExpenseFilters from "../components/ExpenseFilters";

export default function Income() {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [showFilters, setShowFilters] = useState(false);

  const loadIncome = (filters = {}, pageNumber = 1) => {
    const params = new URLSearchParams();
    params.append("page", pageNumber);
    params.append("limit", limit);
    params.append("type", "income"); // 👈 IMPORTANT

    if (filters.categoryId) params.append("categoryId", filters.categoryId);
    if (filters.from) params.append("from", filters.from);
    if (filters.to) params.append("to", filters.to);

    if (filters.sort === "latest") {
      params.append("sortBy", "createdAt");
      params.append("order", "desc");
    }
    if (filters.sort === "oldest") {
      params.append("sortBy", "createdAt");
      params.append("order", "asc");
    }
    if (filters.sort === "amountDesc") {
      params.append("sortBy", "amount");
      params.append("order", "desc");
    }
    if (filters.sort === "amountAsc") {
      params.append("sortBy", "amount");
      params.append("order", "asc");
    }

    api.get(`/transactions?${params.toString()}`).then(res => {
      setTransactions(res.data.expenses);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
    });
  };

  useEffect(() => {
    loadIncome({}, 1);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-gray-800">
      <Navbar />

      <div className="w-full max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-green-700">
            Income
          </h2>

          <button
            onClick={() => setShowFilters(prev => !prev)}
            className="text-sm px-4 py-2 rounded-lg border border-blue-200 bg-white hover:bg-blue-50 transition"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {showFilters && (
          <div className="bg-white border border-sky-100 rounded-xl p-5 shadow-lg mb-8">
            <ExpenseFilters onFilter={(filters) => loadIncome(filters, 1)} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {transactions.map(txn => (
            <div
              key={txn._id}
              className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition flex items-center justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="w-1 rounded-full bg-green-400 mt-1" />
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-green-500 font-semibold">
                    {txn.categoryId?.name}
                  </p>

                  <p className="text-2xl font-bold text-gray-900">
                    ₹ {txn.amount}
                  </p>

                  {txn.note && (
                    <p className="text-sm text-gray-500">
                      {txn.note}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            className="px-4 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            disabled={page === 1}
            onClick={() => loadIncome({}, page - 1)}
          >
            Prev
          </button>

          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>

          <button
            className="px-4 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            disabled={page === totalPages}
            onClick={() => loadIncome({}, page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}