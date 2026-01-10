import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

export default function Categories() {
  const [name, setName] = useState("");
  const [type, setType] = useState("expense");
  const [categories, setCategories] = useState([]);

  const loadCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  const createCategory = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Category name required");
      return;
    }

    try {
      await api.post("/categories", { name, type });
      toast.success("Category added");
      setName("");
      setType("expense");
      loadCategories();
    } catch {
      toast.error("Failed to add category");
    }
  };

  const deleteCategory = async (id) => {
    const ok = window.confirm("Delete this category?");
    if (!ok) return;

    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted");
      loadCategories();
    } catch {
      toast.error("Failed to delete category");
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold text-sky-700 mb-6">
          Categories
        </h2>

        {/* Add category */}
        <form
          onSubmit={createCategory}
          className="bg-white rounded-2xl shadow-sm border border-sky-100 p-6 mb-10 flex flex-col md:flex-row gap-4 items-center"
        >
          <input
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-sky-50 border border-sky-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full md:w-40 bg-sky-50 border border-sky-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <button className="h-[46px] bg-sky-600 text-white px-6 rounded-xl hover:bg-sky-700 transition font-medium shadow-sm">
            Add
          </button>
        </form>

        {/* Category list */}
        {categories.map(cat => (
          <div
            key={cat._id}
            className="bg-sky-50 p-5 rounded-2xl border border-sky-100 shadow-sm mb-4 flex justify-between items-center hover:shadow-md transition"
          >
            <div className="flex flex-col gap-1">
              <p className="font-medium text-slate-800">{cat.name}</p>
            </div>

            <button
              onClick={() => deleteCategory(cat._id)}
              className="text-sm text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}