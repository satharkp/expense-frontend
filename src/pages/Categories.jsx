import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Edit, Trash2, Plus, Save, X } from "lucide-react";

export default function Categories() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);

  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState("");

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
      await api.post("/categories", { name });
      toast.success("Category added");
      setName("");
      loadCategories();
    } catch {
      toast.error("Failed to add category");
    }
  };

  const updateCategory = async (e) => {
    e.preventDefault();

    if (!editName) {
      toast.error("Category name required");
      return;
    }

    try {
      await api.put(`/categories/${editingCategory._id}`, {
        name: editName
      });
      toast.success("Category updated");
      setEditingCategory(null);
      setEditName("");
      loadCategories();
    } catch {
      toast.error("Failed to update category");
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
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight text-primary">Categories</h2>

      {/* Add category */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Category</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={createCategory}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <Input
              type="text"
              placeholder="Category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Category list */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map(cat => (
          <Card key={cat._id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center justify-between">
              {editingCategory?._id === cat._id ? (
                <form onSubmit={updateCategory} className="flex flex-1 items-center gap-2">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="h-9"
                    autoFocus
                  />
                  <Button size="sm" type="submit">
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" type="button" onClick={() => setEditingCategory(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <>
                  <p className="font-medium text-neutral-900">{cat.name}</p>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 border-indigo-100 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-200 shadow-sm transition-colors"
                      onClick={() => {
                        setEditingCategory(cat);
                        setEditName(cat.name);
                      }}
                    >
                      <Edit size={16} className="text-indigo-600" strokeWidth={2.5} />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 border-red-100 bg-red-50 hover:bg-red-100 hover:border-red-200 shadow-sm transition-colors"
                      onClick={() => deleteCategory(cat._id)}
                    >
                      <Trash2 size={16} className="text-red-600" strokeWidth={2.5} />
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}