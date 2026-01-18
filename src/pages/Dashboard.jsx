import { useEffect, useState } from "react";
import api from "../api/axios";
import TransactionForm from "../components/TransactionForm";
import IncomeExpenseChart from "../components/IncomeExpenseChart";
import { toast } from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { ArrowDownCircle, ArrowUpCircle, Wallet, Edit, Trash2 } from "lucide-react";
import { cn } from "../lib/utils";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;
  const [netBalance, setNetBalance] = useState(null);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [editingTransaction, setEditingTransaction] = useState(null);

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
      loadNetBalance(); // Update balance too
    } catch (error) {
      toast.error("Failed to delete transaction");
    }
  };

  useEffect(() => {
    loadExpenses({}, 1);
    loadNetBalance();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight text-primary">Dashboard</h2>
        <Button onClick={exportCSV} variant="outline" className="w-full sm:w-auto">
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600">Total Income</CardTitle>
            <ArrowUpCircle className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">₹ {incomeTotal}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600">Total Expense</CardTitle>
            <ArrowDownCircle className="h-5 w-5 text-danger" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-danger">₹ {expenseTotal}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600">Net Balance</CardTitle>
            <Wallet className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", netBalance >= 0 ? "text-primary" : "text-danger")}>
              ₹ {netBalance}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        <TransactionForm
          editingTransaction={editingTransaction}
          clearEdit={() => setEditingTransaction(null)}
          onSuccess={() => {
            loadExpenses({}, 1);
            loadNetBalance();
            setEditingTransaction(null);
          }}
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-7">
          <div className="lg:col-span-4">
            <div>
              <h3 className="mb-4 text-xl font-semibold text-primary">Recent Transactions</h3>
              <div className="space-y-4">
                {transactions.map(exp => (
                  <div key={exp._id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 shadow-sm hover:shadow-md transition-all gap-4">
                    <div className="flex items-center gap-4">
                      <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-full", exp.type === 'income' ? "bg-success-50 text-success" : "bg-danger-50 text-danger")}>
                        {exp.type === 'income' ? <ArrowUpCircle className="h-6 w-6" /> : <ArrowDownCircle className="h-6 w-6" />}
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900 text-lg">{exp.categoryId?.name || "Uncategorized"}</p>
                        <p className="text-sm text-neutral-500">{new Date(exp.createdAt).toLocaleDateString()}</p>
                        {exp.note && <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">{exp.note}</p>}
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      <span className={cn("font-bold text-lg whitespace-nowrap", exp.type === 'income' ? "text-success" : "text-danger")}>
                        {exp.type === 'income' ? "+" : "-"} ₹ {exp.amount}
                      </span>
                      <div className="flex gap-2 shrink-0">
                        <Button size="icon" variant="outline" className="h-8 w-8 border-indigo-100 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-200 shadow-sm transition-colors" onClick={() => setEditingTransaction(exp)}>
                          <Edit size={16} className="text-indigo-600" strokeWidth={2.5} />
                        </Button>
                        <Button size="icon" variant="outline" className="h-8 w-8 border-red-100 bg-red-50 hover:bg-red-100 hover:border-red-200 shadow-sm transition-colors" onClick={() => deleteExpense(exp._id)}>
                          <Trash2 size={16} className="text-red-600" strokeWidth={2.5} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-6 flex items-center justify-center gap-4">
                <Button variant="outline" size="sm" onClick={() => loadExpenses({}, page - 1)} disabled={page === 1}>
                  Prev
                </Button>
                <span className="text-sm font-medium text-neutral-600">
                  Page {page} of {totalPages}
                </span>
                <Button variant="outline" size="sm" onClick={() => loadExpenses({}, page + 1)} disabled={page === totalPages}>
                  Next
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <IncomeExpenseChart income={incomeTotal} expense={expenseTotal} />
          </div>
        </div>
      </div>
    </div>
  );
}
