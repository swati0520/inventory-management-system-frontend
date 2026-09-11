export const emptyProductFormData = { name: "", sku: "", category: "", description: "", quantity: "", unitPrice: "", supplierName: "", stockStatus: "" };

export const productToFormData = (product = {}) => ({
  ...emptyProductFormData,
  ...product,
  stockStatus: product.status ?? product.stockStatus ?? "",
  category: typeof product.category === "object" ? product.category?.id ?? product.category?._id ?? "" : product.category ?? product.categoryId ?? "",
  quantity: product.quantity ?? "",
  unitPrice: product.unitPrice ?? "",
  supplierName: product.supplierName ?? product.supplier ?? "",
});
