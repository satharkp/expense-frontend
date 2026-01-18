import { useEffect, useState } from "react";
import api from "../api/axios";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";

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
  const [customCategory, setCustomCategory] = useState("");
  const [isOtherCategory, setIsOtherCategory] = useState(false);

  useEffect(() => {
    api.get(`/categories?type=${type}`).then(res => {
      setCategories(res.data);
    });
  }, [type]);

  useEffect(() => {
    setCategoryId("");
    setCustomCategory("");
    setIsOtherCategory(false);
  }, [type]);

  useEffect(() => {
    if (editingTransaction) {
      setAmount(editingTransaction.amount);
      setNote(editingTransaction.note || "");
      setCategoryId(editingTransaction.categoryId?._id || "");
      setType(editingTransaction.type);
      setDate(editingTransaction.date?.slice(0, 10));

      const catName = editingTransaction.categoryId?.name;
      if (catName === "Other") {
        setIsOtherCategory(true);
      } else {
        setIsOtherCategory(false);
      }
    }
  }, [editingTransaction]);

  const handleCategoryChange = (e) => {
    const selectedId = e.target.value;
    setCategoryId(selectedId);

    const selectedCat = categories.find(c => c._id === selectedId);
    if (selectedId === "NEW_CATEGORY" || (selectedCat && selectedCat.name === "Other")) {
      setIsOtherCategory(true);
    } else {
      setIsOtherCategory(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!customCategory) return;
    try {
      const res = await api.post("/categories", { name: customCategory });
      // Assuming res.data is the new category object or contains it. 
      // Based on Categories.jsx logic, it just posts. 
      // We'll re-fetch categories to be safe and ensure consistent format.
      const catRes = await api.get(`/categories?type=${type}`);
      setCategories(catRes.data);

      // Find the new category by name (since we don't know exact ID response structure without looking at controller)
      // Or if res.data returns the category, use it.
      // Let's assume res.data.category based on previous handleSubmit code: finalCategoryId = res.data.category._id;
      if (res.data?.category) {
        setCategoryId(res.data.category._id);
        setIsOtherCategory(false);
        setCustomCategory("");
        toast.success("Category created!");
      } else {
        // Fallback re-fetch strategy
        const newCat = catRes.data.find(c => c.name === customCategory);
        if (newCat) {
          setCategoryId(newCat._id);
          setIsOtherCategory(false);
          setCustomCategory("");
          toast.success("Category created!");
        }
      }
    } catch (error) {
      console.error("Failed to create category", error);
      toast.error("Failed to create category");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalCategoryId = categoryId;

    if (!amount || !categoryId || !type) {
      alert("Amount, category and type are required");
      return;
    }

    if (categoryId === "NEW_CATEGORY" && customCategory) {
      try {
        // Create new category
        const res = await api.post("/categories", { name: customCategory });
        finalCategoryId = res.data.category._id;
      } catch (err) {
        console.error("Failed to create custom category", err);
        alert("Failed to create custom category");
        return;
      }
    } else if (isOtherCategory && customCategory) {
      // fallback for older "Other" behavior if kept
      try {
        const res = await api.post("/categories", { name: customCategory });
        finalCategoryId = res.data.category._id;
      } catch (err) {
        console.error("Failed to create custom category", err);
        alert("Failed to create custom category");
        return;
      }
    }

    try {
      if (editingTransaction) {
        await api.put(`/transactions/${editingTransaction._id}`, {
          amount: Number(amount),
          categoryId: finalCategoryId,
          type,
          note,
          date
        });
      } else {
        await api.post("/transactions", {
          amount: Number(amount),
          categoryId: finalCategoryId,
          type,
          note,
          date
        });
      }

      setAmount("");
      setNote("");
      setCategoryId("");
      setType("expense");
      setDate("");
      setCustomCategory("");
      setIsOtherCategory(false);
      if (clearEdit) clearEdit();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to save transaction");
    }
  };

  return (
    <Card className="border-neutral-200 shadow-sm">
      <CardHeader>
        <CardTitle>{editingTransaction ? "Edit Transaction" : "Add New Transaction"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount</label>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="flex h-11 w-full rounded-xl border border-neutral-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select
                value={categoryId}
                onChange={handleCategoryChange}
                className="flex h-11 w-full rounded-xl border border-neutral-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
                <option value="NEW_CATEGORY" className="font-semibold text-primary">+ Create New Category</option>
              </select>
            </div>

            {isOtherCategory ? (
              <div className="space-y-2">
                <label className="text-sm font-medium">New Category Name</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. Shopping"
                    value={customCategory}
                    onChange={e => setCustomCategory(e.target.value)}
                    required
                  />
                  <Button type="button" onClick={handleCreateCategory} size="sm">Add</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                />
              </div>
            )}

            {isOtherCategory && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                />
              </div>
            )}

            <div className={isOtherCategory ? "md:col-span-2 lg:col-span-3 space-y-2" : "md:col-span-2 lg:col-span-4 space-y-2"}>
              <label className="text-sm font-medium">Note</label>
              <Input
                placeholder="Optional note"
                value={note}
                onChange={e => setNote(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit">
              {editingTransaction ? "Update Transaction" : "Add Transaction"}
            </Button>
            {editingTransaction && (
              <Button variant="ghost" type="button" onClick={clearEdit} className="ml-2">
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}