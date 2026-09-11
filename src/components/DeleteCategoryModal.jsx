import { AlertTriangle, X } from "lucide-react";

function DeleteCategoryModal({ category, isDeleting, onClose, onConfirm }) {
  if (!category) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#160b2a]/75 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="delete-category-title">
      <section className="w-full max-w-md rounded-2xl border border-white/15 bg-[#25133e] p-6 shadow-2xl shadow-black/40">
        <div className="flex items-start justify-between gap-4"><span className="rounded-xl border border-rose-200/20 bg-rose-300/15 p-3 text-rose-100"><AlertTriangle size={22} /></span><button type="button" disabled={isDeleting} onClick={onClose} className="rounded-lg p-1 text-white/60 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50" aria-label="Close delete confirmation"><X size={20} /></button></div>
        <h2 id="delete-category-title" className="mt-5 text-xl font-semibold">Delete Category?</h2>
        <p className="mt-2 text-sm leading-6 text-white/70">Are you sure you want to delete <span className="font-semibold text-white">{category.name}</span>? This action cannot be undone.</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" disabled={isDeleting} onClick={onClose} className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/10 disabled:opacity-50">Cancel</button><button type="button" disabled={isDeleting} onClick={onConfirm} className="rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-60">{isDeleting ? "Deleting..." : "Delete Category"}</button></div>
      </section>
    </div>
  );
}

export default DeleteCategoryModal;
