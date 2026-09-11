import { AlertTriangle, ArrowLeft, CalendarClock, CalendarDays, FileText, PackageSearch, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DeleteProductModal from "../components/DeleteProductModal";
import StockAdjustmentControls from "../components/StockAdjustmentControls";
import StockStatusBadge from "../components/StockStatusBadge";
import { deleteProduct, getProductById } from "../services/productService";
import { getCategoryName, getEntityId, getRecord } from "../utils/apiData";

const formatPrice = (price) => `$${Number(price || 0).toFixed(2)}`;
const formatDate = (date) => date ? new Date(date).toLocaleDateString() : "—";
const getErrorMessage = (error) => error.response?.data?.message || error.message || "Failed to load product.";
const normalizeProduct = (product) => ({ ...product, id: getEntityId(product), stockStatus: product.status ?? product.stockStatus, categoryName: getCategoryName(product.category ?? product.categoryName), supplierName: product.supplierName ?? product.supplier ?? "—" });

function DetailItem({ label, value }) { return <div className="rounded-xl border border-white/10 bg-white/[0.05] p-4"><dt className="text-xs font-semibold uppercase tracking-wider text-white/50">{label}</dt><dd className="mt-2 text-sm font-medium text-white/90">{value}</dd></div>; }
function ProductDetailsSkeleton() { return <div className="animate-pulse space-y-6"><div className="h-8 w-36 rounded bg-white/10" /><div className="rounded-2xl border border-white/10 bg-white/[0.09] p-6 shadow-xl shadow-black/15 backdrop-blur-md sm:p-8"><div className="h-8 w-2/5 rounded bg-white/10" /><div className="mt-3 h-4 w-1/4 rounded bg-white/10" /><div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-20 rounded-xl bg-white/10" />)}</div></div></div>; }

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const loadProduct = async () => {
    try { setIsLoading(true); setLoadError(""); const loadedProduct = normalizeProduct(getRecord(await getProductById(id), "product")); setProduct(loadedProduct); }
    catch (error) { setLoadError(getErrorMessage(error)); }
    finally { setIsLoading(false); }
  };
  useEffect(() => {
    void loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Reload only when the route product changes.
  }, [id]);
  const handleDelete = async () => {
    try { setIsDeleting(true); setProduct((currentProduct) => ({ ...currentProduct, deleteError: "" })); await deleteProduct(product.id); navigate("/products", { replace: true }); }
    catch (error) { setProduct((currentProduct) => ({ ...currentProduct, deleteError: error.response?.data?.message || "Failed to delete product." })); }
    finally { setIsDeleting(false); }
  };
  if (isLoading) return <main className="relative min-h-screen overflow-hidden bg-[#160b2a] px-4 py-8 font-sans text-white sm:px-6 lg:px-8"><div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#8b263d_0%,transparent_38%),radial-gradient(circle_at_92%_86%,#4767c8_0%,transparent_34%),radial-gradient(circle_at_5%_92%,#763a51_0%,transparent_36%)]" /><div className="relative mx-auto max-w-5xl"><ProductDetailsSkeleton /></div></main>;
  if (loadError) return <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#160b2a] px-4 py-8 font-sans text-white sm:px-6 lg:px-8"><div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#8b263d_0%,transparent_38%),radial-gradient(circle_at_92%_86%,#4767c8_0%,transparent_34%),radial-gradient(circle_at_5%_92%,#763a51_0%,transparent_36%)]" /><section className="relative w-full max-w-md rounded-2xl border border-rose-200/20 bg-white/[0.09] px-6 py-14 text-center shadow-xl shadow-black/15 backdrop-blur-md"><AlertTriangle className="mx-auto text-rose-100" size={28} /><h1 className="mt-5 text-2xl font-semibold">Could not load product</h1><p className="mt-2 text-sm leading-6 text-white/65">{loadError}</p><button type="button" onClick={loadProduct} className="mt-6 rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold">Retry</button></section></main>;
  if (!product?.id) return <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#160b2a] px-4 py-8 font-sans text-white sm:px-6 lg:px-8"><div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#8b263d_0%,transparent_38%),radial-gradient(circle_at_92%_86%,#4767c8_0%,transparent_34%),radial-gradient(circle_at_5%_92%,#763a51_0%,transparent_36%)]" /><section className="relative w-full max-w-md rounded-2xl border border-dashed border-white/20 bg-white/[0.06] px-6 py-14 text-center"><PackageSearch className="mx-auto text-indigo-100" size={28} /><h1 className="mt-5 text-2xl font-semibold">Product not found</h1><button type="button" onClick={() => navigate("/products")} className="mt-6 rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold">Back to Products</button></section></main>;
  return <main className="relative min-h-screen overflow-hidden bg-[#160b2a] px-4 py-8 font-sans text-white sm:px-6 lg:px-8"><div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#8b263d_0%,transparent_38%),radial-gradient(circle_at_92%_86%,#4767c8_0%,transparent_34%),radial-gradient(circle_at_5%_92%,#763a51_0%,transparent_36%)]" /><div className="relative mx-auto max-w-5xl"><button type="button" onClick={() => navigate("/products")} className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-white/75 transition hover:text-white"><ArrowLeft size={16} /> Back to Products</button><section className="rounded-2xl border border-white/10 bg-white/[0.09] p-6 shadow-xl shadow-black/15 backdrop-blur-md sm:p-8"><div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between"><div><div className="flex flex-wrap items-center gap-3"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-200">Product Details</p><StockStatusBadge status={product.stockStatus} /></div><h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{product.name}</h1><p className="mt-2 text-sm text-white/65">SKU: {product.sku}</p></div><div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row"><button type="button" onClick={() => navigate(`/products/${id}/edit`)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/10"><Pencil size={17} /> Edit Product</button><button type="button" onClick={() => setIsDeleteModalOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-400"><Trash2 size={17} /> Delete Product</button></div></div><div className="mt-8 border-t border-white/10 pt-8"><div className="flex items-center gap-2 text-sm font-semibold text-white/90"><FileText size={18} className="text-indigo-100" /> Description</div><p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">{product.description || "No description provided."}</p></div><dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"><DetailItem label="Category" value={product.categoryName} /><DetailItem label="Quantity" value={product.quantity} /><DetailItem label="Unit Price" value={formatPrice(product.unitPrice)} /><DetailItem label="Supplier" value={product.supplierName} /><DetailItem label="Created Date" value={<span className="inline-flex items-center gap-2"><CalendarDays size={16} className="text-indigo-100" /> {formatDate(product.createdAt)}</span>} /><DetailItem label="Updated Date" value={<span className="inline-flex items-center gap-2"><CalendarClock size={16} className="text-indigo-100" /> {formatDate(product.updatedAt)}</span>} /></dl><StockAdjustmentControls productId={product.id} onUpdated={loadProduct} /></section></div><DeleteProductModal product={isDeleteModalOpen ? product : null} isDeleting={isDeleting} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} /></main>;
}

export default ProductDetails;
