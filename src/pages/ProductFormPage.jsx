import { AlertTriangle, ArrowLeft, PackagePlus, PackageSearch, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import { getCategories } from "../services/categoryService";
import { createProduct, getProductById, updateProduct } from "../services/productService";
import { getCollection, getEntityId, getRecord } from "../utils/apiData";
import { emptyProductFormData } from "../utils/productFormUtils";

const pageClass = "relative min-h-screen overflow-hidden bg-[#160b2a] px-4 py-8 font-sans text-white sm:px-6 lg:px-8";
const getErrorMessage = (error) => error.response?.data?.message || error.message || "Failed to load product.";

function PageBackground() {
  return <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#8b263d_0%,transparent_38%),radial-gradient(circle_at_92%_86%,#4767c8_0%,transparent_34%),radial-gradient(circle_at_5%_92%,#763a51_0%,transparent_36%)]" />;
}

function ProductFormSkeleton() {
  return <main className={pageClass}><PageBackground /><div className="relative mx-auto max-w-4xl animate-pulse"><div className="mb-5 h-5 w-36 rounded bg-white/10" /><section className="rounded-2xl border border-white/10 bg-white/[0.09] p-8"><div className="h-12 w-12 rounded-xl bg-white/10" /><div className="mt-5 h-8 w-52 rounded bg-white/10" /><div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">{Array.from({ length: 7 }, (_, index) => <div key={index} className="h-20 rounded-xl bg-white/10" />)}</div></section></div></main>;
}

function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [categoryLoadError, setCategoryLoadError] = useState("");

  const loadProduct = async () => {
    try {
      setIsLoading(true);
      setLoadError("");
      setProduct(getRecord(await getProductById(id), "product"));
    } catch (error) {
      setLoadError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isEditMode) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- The async request updates local page data after it completes.
      void loadProduct();
    }

    const loadCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(getCollection(response, "categories").map((category) => ({ ...category, id: getEntityId(category) })));
      } catch (error) {
        setCategoryLoadError(error.response?.data?.message || "Failed to load categories.");
      } finally {
        setIsCategoriesLoading(false);
      }
    };

    void loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Reload only when the route product changes.
  }, [id, isEditMode]);

  const handleSubmit = async (productData) => {
    const { stockStatus, ...productFields } = productData;
    const normalizedProductData = { ...productFields, status: stockStatus, quantity: Number(productData.quantity), unitPrice: Number(productData.unitPrice) };

    try {
      setIsSubmitting(true);
      if (isEditMode) {
        await updateProduct(id, normalizedProductData);
        navigate(`/products/${id}`, { replace: true });
      } else {
        await createProduct(normalizedProductData);
        navigate("/products", { replace: true });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditMode && isLoading) return <ProductFormSkeleton />;

  if (isEditMode && loadError) return <main className={`${pageClass} flex items-center justify-center`}><PageBackground /><section className="relative w-full max-w-md rounded-2xl border border-rose-200/20 bg-white/[0.09] px-6 py-12 text-center"><AlertTriangle className="mx-auto text-rose-100" size={28} /><h1 className="mt-5 text-2xl font-semibold">Could not load product</h1><p className="mt-2 text-sm text-white/65">{loadError}</p><button type="button" onClick={loadProduct} className="mt-6 rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold">Retry</button></section></main>;

  if (isEditMode && !product) return <main className={`${pageClass} flex items-center justify-center`}><PageBackground /><section className="relative w-full max-w-md rounded-2xl border border-dashed border-white/20 bg-white/[0.06] px-6 py-14 text-center"><PackageSearch className="mx-auto text-indigo-100" size={28} /><h1 className="mt-5 text-2xl font-semibold">Product not found</h1><button type="button" onClick={() => navigate("/products")} className="mt-6 rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold">Back to Products</button></section></main>;

  const destination = isEditMode ? `/products/${id}` : "/products";
  const heading = isEditMode ? "Edit Product" : "Add Product";
  const description = isEditMode ? <>Update the details for <span className="font-semibold text-white/90">{product.name}</span>.</> : "Enter the product details to prepare it for your inventory.";

  return <main className={pageClass}><PageBackground /><div className="relative mx-auto max-w-4xl"><button type="button" onClick={() => navigate(destination)} className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-white/75 transition hover:text-white"><ArrowLeft size={16} /> {isEditMode ? "Back to product details" : "Back to products"}</button><section className="rounded-2xl border border-white/10 bg-white/[0.09] p-6 shadow-xl shadow-black/15 backdrop-blur-md sm:p-8"><div className="flex items-start gap-4"><span className={`rounded-xl border border-white/15 p-3 ${isEditMode ? "bg-amber-300/15 text-amber-100" : "bg-indigo-300/20 text-indigo-100"}`}>{isEditMode ? <Pencil size={24} /> : <PackagePlus size={24} />}</span><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-200">Products</p><h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h1><p className="mt-2 text-sm leading-6 text-white/70">{description}</p></div></div><ProductForm key={id ?? "create"} categories={categories} categoryLoadError={categoryLoadError} initialValues={isEditMode ? product : emptyProductFormData} isCategoriesLoading={isCategoriesLoading} isSubmitting={isSubmitting} onSubmit={handleSubmit} onCancel={() => navigate(destination)} submitLabel={isEditMode ? "Save Changes" : "Save Product"} /></section></div></main>;
}

export default ProductFormPage;
