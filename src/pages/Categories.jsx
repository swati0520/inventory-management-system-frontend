import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import CategoryFormModal from "../components/CategoryFormModal";
import DeleteCategoryModal from "../components/DeleteCategoryModal";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../services/categoryService";
import { getCollection } from "../utils/apiData";

const getCategoryId = (category) => category.id || category._id;

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryForForm, setCategoryForForm] = useState(undefined);
  const [categoryForDelete, setCategoryForDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const filteredCategories = useMemo(() => {
    const searchValue = searchTerm.trim().toLowerCase();
    if (!searchValue) return categories;
    return categories.filter((category) => [category.name, category.description].some((value) => value?.toLowerCase().includes(searchValue)));
  }, [categories, searchTerm]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getCategories();
      setCategories(getCollection(response, "categories"));
    } catch (fetchError) {
      setError(fetchError?.response?.data?.message || "Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Fetch completion updates local page data.
    void fetchCategories();
  }, []);

  const handleSaveCategory = async (categoryData) => {
    try {
      setError("");
      if (categoryForForm) await updateCategory(getCategoryId(categoryForForm), categoryData);
      else await createCategory(categoryData);
      await fetchCategories();
      setCategoryForForm(undefined);
    } catch (saveError) {
      throw new Error(
        saveError?.response?.data?.message || "Failed to save category.",
        { cause: saveError }
      );
    }
  };

  const handleConfirmDelete = async () => {
    if (!categoryForDelete) return;
    try {
      setIsDeleting(true);
      setError("");
      await deleteCategory(getCategoryId(categoryForDelete));
      await fetchCategories();
      setCategoryForDelete(null);
    } catch (deleteError) {
      setError(deleteError?.response?.data?.message || "Failed to delete category.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#160b2a] px-4 py-8 font-sans text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#8b263d_0%,transparent_38%),radial-gradient(circle_at_92%_86%,#4767c8_0%,transparent_34%),radial-gradient(circle_at_5%_92%,#763a51_0%,transparent_36%)]" />
      <div className="relative mx-auto max-w-7xl">
        <header className="flex flex-col justify-between gap-5 rounded-2xl border border-white/10 bg-white/[0.09] p-6 shadow-xl shadow-black/15 backdrop-blur-md sm:flex-row sm:items-end sm:p-8">
          <div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Categories</h1>

          </div>
          <button type="button" onClick={() => setCategoryForForm(null)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#56052e] via-[#61285e] to-[#5d75dc] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-950/30 transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/70"><Plus size={18} /> Add Category</button>
        </header>

        {error && <p className="mt-6 rounded-xl border border-rose-200/20 bg-rose-300/15 px-4 py-3 text-sm text-rose-100">{error}</p>}

        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.09] p-4 shadow-xl shadow-black/15 backdrop-blur-md sm:p-5">
          <div className="text-sm font-semibold text-white/90">Find categories</div>
          <label className="relative mt-4 block max-w-md">
            <span className="sr-only">Search categories</span><Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/45" />
            <input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search by name or description" className="w-full rounded-xl border border-white/15 bg-white/[0.08] py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-indigo-200/80 focus:ring-2 focus:ring-indigo-200/30" />
          </label>
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.09] shadow-xl shadow-black/15 backdrop-blur-md">
          <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm">
            <thead className="border-b border-white/10 bg-white/[0.04] text-xs uppercase tracking-wider text-white/55"><tr><th className="px-6 py-4 font-semibold">S.N.</th><th className="px-6 py-4 font-semibold">Name</th><th className="px-6 py-4 font-semibold">Description</th><th className="px-6 py-4 text-center font-semibold">Actions</th></tr></thead>
            <tbody className="divide-y divide-white/10">
              {loading ? <tr><td colSpan={4} className="px-6 py-12 text-center text-white/65">Loading categories...</td></tr> : filteredCategories.length > 0 ? filteredCategories.map((category, index) => (
                <tr key={getCategoryId(category)} className="transition hover:bg-white/[0.05]">
                  <td className="px-6 py-4 text-white/55">{index + 1}</td><td className="px-6 py-4 font-semibold text-white">{category.name}</td><td className="px-6 py-4 text-white/70">{category.description || "—"}</td>
                  <td className="px-6 py-4"><div className="flex justify-center gap-2"><button type="button" onClick={() => setCategoryForForm(category)} className="rounded-lg p-2 text-amber-100 transition hover:bg-amber-300/15" aria-label="Edit category"><Pencil size={17} /></button><button type="button" onClick={() => setCategoryForDelete(category)} className="rounded-lg p-2 text-rose-100 transition hover:bg-rose-300/15" aria-label="Delete category"><Trash2 size={17} /></button></div></td>
                </tr>
              )) : <tr><td colSpan={4} className="px-6 py-12 text-center text-white/65">{searchTerm ? "No categories found." : "No categories available."}</td></tr>}
            </tbody>
          </table></div>
        </section>

        {categoryForForm !== undefined && <CategoryFormModal key={categoryForForm ? getCategoryId(categoryForForm) : "new"} category={categoryForForm} onClose={() => setCategoryForForm(undefined)} onSubmit={handleSaveCategory} />}
        {categoryForDelete && <DeleteCategoryModal category={categoryForDelete} isDeleting={isDeleting} onClose={() => setCategoryForDelete(null)} onConfirm={handleConfirmDelete} />}
      </div>
    </main>
  );
};

export default Categories;
