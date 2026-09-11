import { useState } from "react";
import { emptyProductFormData, productToFormData } from "../utils/productFormUtils";
import { validateProduct } from "../utils/validation";

const stockStatusOptions = ["In Stock", "Low Stock", "Out of Stock"];

const productInputFields = {
  beforeCategory: [
    { name: "name", label: "Product Name", type: "text", placeholder: "e.g. Wireless Keyboard" },
    { name: "sku", label: "SKU", type: "text", placeholder: "e.g. KEY-001" },
  ],
  afterCategory: [
    { name: "supplierName", label: "Supplier", type: "text", placeholder: "e.g. Acme Supplies" },
    { name: "quantity", label: "Quantity", type: "number", placeholder: "e.g. 25", min: "0", step: "1", inputMode: "numeric" },
    { name: "unitPrice", label: "Unit Price", type: "number", placeholder: "e.g. 49.99", min: "0", step: "0.01", inputMode: "decimal" },
  ],
};

const getFieldClassName = (hasError) => `w-full rounded-xl border bg-white/[0.08] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:ring-2 ${hasError ? "border-rose-300/80 focus:border-rose-200 focus:ring-rose-200/30" : "border-white/15 focus:border-indigo-200/80 focus:ring-indigo-200/30"}`;

function FormField({ children, error, id, label, optional = false }) {
  const errorId = `${id}-error`;
  return <div><label className="mb-2 block text-sm font-medium text-white/90" htmlFor={id}>{label}{optional && <span className="text-white/50"> (optional)</span>}</label>{children}{error && <p id={errorId} className="mt-2 text-sm text-rose-200">{error}</p>}</div>;
}

function ProductForm({ categories = [], categoryLoadError = "", initialValues = emptyProductFormData, isCategoriesLoading = false, isSubmitting, onCancel, onSubmit, submitLabel }) {
  const [formData, setFormData] = useState(() => productToFormData(initialValues));
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
    setSubmitError("");
    setErrors((currentErrors) => {
      if (!currentErrors[name]) return currentErrors;
      const remainingErrors = { ...currentErrors };
      delete remainingErrors[name];
      return remainingErrors;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateProduct(formData);
    setErrors(validationErrors);
    setSubmitError("");
    if (Object.keys(validationErrors).length > 0) return;
    try { await onSubmit(formData); } catch (error) { setSubmitError(error.response?.data?.message || error.message || "Unable to save the product. Please try again."); }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {productInputFields.beforeCategory.map((field) => <FormField key={field.name} id={field.name} label={field.label} error={errors[field.name]}><input {...field} id={field.name} value={formData[field.name]} onChange={handleChange} className={getFieldClassName(errors[field.name])} aria-invalid={Boolean(errors[field.name])} aria-describedby={errors[field.name] ? `${field.name}-error` : undefined} /></FormField>)}
        <FormField id="category" label="Category" error={errors.category}><select id="category" name="category" value={formData.category} onChange={handleChange} disabled={isCategoriesLoading || categories.length === 0} className={getFieldClassName(errors.category)} aria-invalid={Boolean(errors.category)} aria-describedby={errors.category ? "category-error" : undefined}><option value="" className="text-slate-900">{isCategoriesLoading ? "Loading categories..." : categoryLoadError ? "Categories unavailable" : categories.length === 0 ? "No categories available" : "Select a category"}</option>{categories.map((category) => <option key={category.id} value={category.id} className="text-slate-900">{category.name}</option>)}</select>{categoryLoadError && <p className="mt-2 text-sm text-rose-200">{categoryLoadError}</p>}</FormField>
        <FormField id="stockStatus" label="Stock Status" error={errors.stockStatus}><select id="stockStatus" name="stockStatus" value={formData.stockStatus} onChange={handleChange} className={getFieldClassName(errors.stockStatus)} aria-invalid={Boolean(errors.stockStatus)} aria-describedby={errors.stockStatus ? "stockStatus-error" : undefined}><option value="" className="text-slate-900">Select stock status</option>{stockStatusOptions.map((status) => <option key={status} value={status} className="text-slate-900">{status}</option>)}</select></FormField>
        {productInputFields.afterCategory.map((field) => <FormField key={field.name} id={field.name} label={field.label} error={errors[field.name]}><input {...field} id={field.name} value={formData[field.name]} onChange={handleChange} className={getFieldClassName(errors[field.name])} aria-invalid={Boolean(errors[field.name])} aria-describedby={errors[field.name] ? `${field.name}-error` : undefined} /></FormField>)}
      </div>
      <FormField id="description" label="Description" optional><textarea id="description" name="description" rows="4" value={formData.description} onChange={handleChange} placeholder="Add a short description of the product" className={`${getFieldClassName(false)} resize-y`} /></FormField>
      {submitError && <p role="alert" className="rounded-xl border border-rose-200/25 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">{submitError}</p>}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={onCancel} className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10">Cancel</button><button type="submit" disabled={isSubmitting} className="rounded-xl bg-gradient-to-r from-[#56052e] via-[#61285e] to-[#5d75dc] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-950/30 transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/70 disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? "Saving..." : submitLabel}</button></div>
    </form>
  );
}

export default ProductForm;
