import { useEffect, useState } from "react";
import api from "../api/axios";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Filter, X } from "lucide-react";

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
    <Card className="border-neutral-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Filter className="h-4 w-4" /> Filters
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-neutral-500 hover:text-neutral-900">
          <X className="h-4 w-4 mr-2" /> Clear
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-600">Category</label>
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-neutral-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <option value="">All categories</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-600">From</label>
            <Input
              type="date"
              value={from}
              onChange={e => setFrom(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-600">To</label>
            <Input
              type="date"
              value={to}
              onChange={e => setTo(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-600">Sort By</label>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-neutral-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <option value="latest">Latest first</option>
              <option value="oldest">Oldest first</option>
              <option value="amountDesc">Amount: High → Low</option>
              <option value="amountAsc">Amount: Low → High</option>
            </select>
          </div>

          <Button onClick={applyFilters} className="w-full">
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}