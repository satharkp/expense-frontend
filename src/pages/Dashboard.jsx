import { useEffect, useState } from "react";
import api from "../api/axios";
import TransactionForm from "../components/TransactionForm";
import Navbar from "../components/Navbar";
import IncomeExpenseChart from "../components/IncomeExpenseChart";
import { toast } from "react-hot-toast";


export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;
  const [netBalance, setNetBalance] = useState(null);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);

  const exportCSV = () => {
    if (!transactions.length) {
      toast.error("No transactions to export");
      return;
    }

    const headers = ["Date", "Type", "Category", "Amount", "Note"];

    const rows = transactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.type,
      t.categoryId?.name || "-",
      t.amount,
      t.note || ""
    ]);

    const csv = [headers, ...rows]
      .map(row => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  const loadExpenses = (filters = {}, pageNumber = 1) => {
    const params = new URLSearchParams();

    params.append("page", pageNumber);
    params.append("limit", limit);

    if (filters.categoryId) params.append("categoryId", filters.categoryId);
    if (filters.from) params.append("from", filters.from);
    if (filters.to) params.append("to", filters.to);

    api.get(`/transactions?${params.toString()}`)
      .then(res => {
        setTransactions(res.data.expenses);
        setPage(res.data.page);
        setTotalPages(res.data.totalPages);
      });
  };

  const loadNetBalance = async () => {
    const res = await api.get("/analytics/net-balance");
    setIncomeTotal(res.data.income);
    setExpenseTotal(res.data.expense);
    setNetBalance(res.data.netBalance);
  };

  const deleteExpense = async (id) => {
    const ok = window.confirm("Delete this transaction?");
    if (!ok) return;

    try {
      await api.delete(`/transactions/${id}`);
      toast.success("Transaction deleted");
      loadExpenses({}, page);
    } catch (error) {
      toast.error("Failed to delete transaction");
    }
  };
  const [editingTransaction, setEditingTransaction] = useState(null);
  useEffect(() => {
    loadExpenses({}, 1);
    loadNetBalance();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-gray-800">
      <Navbar />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-sky-700">
          Dashboard
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
            <p className="text-sm text-gray-500">Income</p>
            <p className="text-2xl font-semibold text-green-600">
              ₹ {incomeTotal}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
            <p className="text-sm text-gray-500">Expense</p>
            <p className="text-2xl font-semibold text-red-500">
              ₹ {expenseTotal}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-sky-100">
            <p className="text-sm text-gray-500">Net Balance</p>
            <p
              className={`text-2xl font-semibold ${
                netBalance >= 0 ? "text-sky-600" : "text-red-600"
              }`}
            >
              ₹ {netBalance}
            </p>
          </div>
        </div>

        {/* Income vs Expense Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
          <IncomeExpenseChart
            income={incomeTotal}
            expense={expenseTotal}
          />
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-xl mb-8">
          <TransactionForm
            editingTransaction={editingTransaction}
            clearEdit={() => setEditingTransaction(null)}
            onSuccess={() => {
              loadExpenses({}, 1);
              loadNetBalance();
              setEditingTransaction(null);
            }}
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-3 mb-4">
          <button
            onClick={exportCSV}
            className="px-4 py-2 rounded-lg bg-sky-600 text-white text-sm hover:bg-sky-700 transition"
          >
            Export CSV
          </button>
        </div>

        <h3 className="mt-6 mb-4 text-lg font-semibold text-sky-700">
          Recent Transactions
        </h3>
        {transactions.map(exp => (
          <div
            key={exp._id}
            className="bg-sky-50 border border-sky-100 rounded-xl p-4 sm:p-5 mb-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <div>
              <p className="text-sm text-sky-600 font-medium">
                {exp.categoryId?.name}
              </p>
              <p className="text-xl font-semibold text-gray-900">
                ₹ {exp.amount}
              </p>
              {exp.note && (
                <p className="text-sm text-gray-500">
                  {exp.note}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                Added on {new Date(exp.createdAt).toLocaleString()}
              </p>

              {exp.updatedAt !== exp.createdAt && (
                <p className="text-xs text-gray-400">
                  Updated on {new Date(exp.updatedAt).toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setEditingTransaction(exp)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-sky-600 border border-sky-200 hover:bg-sky-50"
              >
                Edit
              </button>

              <button
                onClick={() => deleteExpense(exp._id)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:text-white hover:bg-red-500 transition border border-red-100"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            className="px-4 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            disabled={page === 1}
            onClick={() => loadExpenses({}, page - 1)}
          >
            Prev
          </button>

          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>

          <button
            className="px-4 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            disabled={page === totalPages}
            onClick={() => loadExpenses({}, page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
