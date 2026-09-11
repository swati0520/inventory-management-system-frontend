import { useState } from "react";
import { X } from "lucide-react";
import { validateCategory } from "../utils/validation";

const getInitialForm = (category) => ({
  name: category?.name || "",
  description: category?.description || "",
});

const CategoryFormModal = ({ category, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(() => getInitialForm(category));
  const [error, setError] = useState("");

  const isEditMode = Boolean(category);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = formData.name.trim();
    const description = formData.description.trim();

    const validationError = validateCategory({ name });
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await onSubmit({
        name,
        description,
      });
    } catch (submitError) {
      setError(
        submitError?.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#160b2a]/75 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#25133e] text-white shadow-2xl shadow-black/40">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="text-lg font-semibold">
            {isEditMode ? "Edit Category" : "Add Category"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-white/60 transition hover:bg-white/10 hover:text-white"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label
              htmlFor="category-name"
              className="mb-1 block text-sm font-medium text-white/85"
            >
              Category Name
            </label>

            <input
              id="category-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter category name"
              className="w-full rounded-xl border border-white/15 bg-white/[0.08] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-indigo-200/80 focus:ring-2 focus:ring-indigo-200/30"
            />
          </div>

          <div>
            <label
              htmlFor="category-description"
              className="mb-1 block text-sm font-medium text-white/85"
            >
              Description
            </label>

            <textarea
              id="category-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter category description"
              rows={4}
              className="w-full resize-none rounded-xl border border-white/15 bg-white/[0.08] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-indigo-200/80 focus:ring-2 focus:ring-indigo-200/30"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-rose-300/15 px-3 py-2 text-sm text-rose-100">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/10"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-[#56052e] via-[#61285e] to-[#5d75dc] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              {isEditMode ? "Update Category" : "Save Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormModal;
