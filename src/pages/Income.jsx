import { useEffect, useState } from "react";
import api from "../api/axios";
import ExpenseFilters from "../components/ExpenseFilters";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { ArrowUpCircle } from "lucide-react";

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
    params.append("type", "income");

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
      setTransactions(res.data.expenses); // API returns 'expenses' key even for income
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
    });
  };

  useEffect(() => {
    loadIncome({}, 1);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-success">Income</h2>
        <Button
          variant="outline"
          onClick={() => setShowFilters(prev => !prev)}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>

      {showFilters && (
        <ExpenseFilters onFilter={(filters) => loadIncome(filters, 1)} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {transactions.map(txn => (
          <Card key={txn._id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success-50 text-success">
                <ArrowUpCircle className="h-6 w-6" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-neutral-500">{txn.categoryId?.name}</p>
                  <p className="text-xs text-neutral-400">{new Date(txn.createdAt).toLocaleDateString()}</p>
                </div>
                <p className="text-2xl font-bold text-neutral-900">₹ {txn.amount}</p>
                {txn.note && (
                  <p className="text-sm text-neutral-600 line-clamp-2">{txn.note}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-8">
        <Button variant="outline" onClick={() => loadIncome({}, page - 1)} disabled={page === 1}>
          Prev
        </Button>
        <span className="flex items-center text-sm text-neutral-600">
          Page {page} of {totalPages}
        </span>
        <Button variant="outline" onClick={() => loadIncome({}, page + 1)} disabled={page === totalPages}>
          Next
        </Button>
      </div>
    </div>
  );
}