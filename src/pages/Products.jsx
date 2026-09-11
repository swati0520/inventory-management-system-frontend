import {
  Eye,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  PackageSearch,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import DeleteProductModal from "../components/DeleteProductModal";
import ProductsTableSkeleton from "../components/ProductsTableSkeleton";
import StockStatusBadge from "../components/StockStatusBadge";

import { getCategories } from "../services/categoryService";
import { deleteProduct, getProducts } from "../services/productService";

import {
  getCategoryName,
  getCollection,
  getEntityId,
} from "../utils/apiData";

const PAGE_SIZE = 5;

const stockOptions = [
  "All stock statuses",
  "In Stock",
  "Low Stock",
  "Out of Stock",
];

const sortOptions = [
  {
    value: "name",
    label: "Name: A to Z",
  },
  {
    value: "quantity-high",
    label: "Quantity: high to low",
  },
  {
    value: "quantity-low",
    label: "Quantity: low to high",
  },
  {
    value: "price-high",
    label: "Price: high to low",
  },
  {
    value: "price-low",
    label: "Price: low to high",
  },
];

const formatPrice = (price) => {
  return `$${Number(price || 0).toFixed(2)}`;
};

const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong."
  );
};

const normalizeProduct = (product) => ({
  ...product,
  id: getEntityId(product),

  // Backend field: status
  // Frontend field: stockStatus
  stockStatus: product.status ?? product.stockStatus,

  categoryName: getCategoryName(
    product.category ?? product.categoryName
  ),
});

function ProductActions({ product, onView, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        onClick={onView}
        title="View product"
        aria-label={`View ${product.name}`}
        className="rounded-lg p-2 text-indigo-100 transition hover:bg-indigo-300/15"
      >
        <Eye size={17} />
      </button>

      <button
        type="button"
        onClick={onEdit}
        title="Edit product"
        aria-label={`Edit ${product.name}`}
        className="rounded-lg p-2 text-amber-100 transition hover:bg-amber-300/15"
      >
        <Pencil size={17} />
      </button>

      <button
        type="button"
        onClick={onDelete}
        title="Delete product"
        aria-label={`Delete ${product.name}`}
        className="rounded-lg p-2 text-rose-100 transition hover:bg-rose-300/15"
      >
        <Trash2 size={17} />
      </button>
    </div>
  );
}

function ProductCard({ product, actions }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.09] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">{product.name}</h2>

          <p className="mt-1 text-sm text-white/60">
            {product.sku}
          </p>
        </div>

        <StockStatusBadge status={product.stockStatus} />
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-white/50">Category</dt>
          <dd className="mt-1">{product.categoryName}</dd>
        </div>

        <div>
          <dt className="text-white/50">Quantity</dt>
          <dd className="mt-1">{product.quantity}</dd>
        </div>

        <div>
          <dt className="text-white/50">Unit Price</dt>
          <dd className="mt-1">
            {formatPrice(product.unitPrice)}
          </dd>
        </div>
      </dl>

      <div className="mt-5">{actions}</div>
    </article>
  );
}

function ProductTable({ products, getActions }) {
  return (
    <div className="hidden overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.09] md:block">
      <table className="w-full min-w-[850px] text-left">
        <thead className="border-b border-white/10 text-xs uppercase text-white/55">
          <tr>
            {[
              "Product Name",
              "SKU",
              "Category",
              "Quantity",
              "Unit Price",
              "Stock Status",
              "Actions",
            ].map((heading) => (
              <th key={heading} className="px-5 py-4">
                {heading}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-white/10">
          {products.map((product) => (
            <tr
              key={product.id}
              className="transition hover:bg-white/[0.05]"
            >
              <td className="px-5 py-4 font-semibold">
                {product.name}
              </td>

              <td className="px-5 py-4 text-white/65">
                {product.sku}
              </td>

              <td className="px-5 py-4">
                {product.categoryName}
              </td>

              <td className="px-5 py-4">
                {product.quantity}
              </td>

              <td className="px-5 py-4">
                {formatPrice(product.unitPrice)}
              </td>

              <td className="px-5 py-4">
                <StockStatusBadge status={product.stockStatus} />
              </td>

              <td className="px-5 py-4">
                {getActions(product)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [stockStatus, setStockStatus] = useState(
    "All stock statuses"
  );
  const [sortBy, setSortBy] = useState("name");
  const [page, setPage] = useState(1);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [categoryLoadError, setCategoryLoadError] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProducts();

      const productList = getCollection(
        response,
        "products"
      ).map(normalizeProduct);

      setProducts(productList);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      setCategoryLoadError("");
      const response = await getCategories();

      setCategories(
        getCollection(response, "categories")
      );
    } catch (requestError) {
      setCategories([]);
      setCategoryLoadError(getErrorMessage(requestError));
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- The async requests update local products data after they complete.
    loadProducts();
    loadCategories();
  }, []);

  const categoryOptions = useMemo(() => {
    return categories
      .map((item) => ({
        id: getEntityId(item),
        name: item.name,
      }))
      .filter((item) => item.id && item.name);
  }, [categories]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...products]
      .filter((product) => {
        const matchesSearch = [
          product.name,
          product.sku,
          product.categoryName,
        ].some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(query)
        );

        const productCategory = String(
          getEntityId(product.category) ??
          product.categoryId ??
          product.categoryName
        );

        const matchesCategory =
          category === "All categories" ||
          productCategory === category;

        const matchesStockStatus =
          stockStatus === "All stock statuses" ||
          product.stockStatus === stockStatus;

        return (
          matchesSearch &&
          matchesCategory &&
          matchesStockStatus
        );
      })
      .sort((firstProduct, secondProduct) => {
        if (sortBy === "quantity-high") {
          return (
            secondProduct.quantity - firstProduct.quantity
          );
        }

        if (sortBy === "quantity-low") {
          return (
            firstProduct.quantity - secondProduct.quantity
          );
        }

        if (sortBy === "price-high") {
          return (
            secondProduct.unitPrice - firstProduct.unitPrice
          );
        }

        if (sortBy === "price-low") {
          return (
            firstProduct.unitPrice - secondProduct.unitPrice
          );
        }

        return String(firstProduct.name).localeCompare(
          String(secondProduct.name)
        );
      });
  }, [
    products,
    search,
    category,
    stockStatus,
    sortBy,
  ]);

  const totalPages = Math.max(
    Math.ceil(filteredProducts.length / PAGE_SIZE),
    1
  );

  const visibleProducts = filteredProducts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const resetPage = () => {
    setPage(1);
  };

  const getActions = (product) => {
    return (
      <ProductActions
        product={product}
        onView={() => navigate(`/products/${product.id}`)}
        onEdit={() => navigate(`/products/${product.id}/edit`)}
        onDelete={() => setSelectedProduct(product)}
      />
    );
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;

    try {
      setDeleting(true);
      setError("");

      await deleteProduct(selectedProduct.id);

      setSelectedProduct(null);
      await loadProducts();

      if (page > 1 && visibleProducts.length === 1) {
        setPage((currentPage) => currentPage - 1);
      }
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#160b2a] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col justify-between gap-5 rounded-2xl border border-white/10 bg-white/[0.09] p-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-indigo-200">
              Inventory
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Products
            </h1>

            <p className="mt-2 text-sm text-white/70">
              Browse and manage your inventory products.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/products/add")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold transition hover:bg-indigo-500"
          >
            <Plus size={18} />
            Add Product
          </button>
        </header>

        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.09] p-5">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <SlidersHorizontal size={17} />
            Find products
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-white/45" />

              <input
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  resetPage();
                }}
                placeholder="Search products"
                className="w-full rounded-xl border border-white/15 bg-white/[0.08] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400"
              />
            </label>

            <select
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
                resetPage();
              }}
              className="rounded-xl border border-white/15 bg-white/[0.08] px-3 py-3 text-sm outline-none transition focus:border-indigo-400"
            >
              <option value="All categories">
                All categories
              </option>

              {categoryOptions.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                  className="text-slate-900"
                >
                  {item.name}
                </option>
              ))}
            </select>

            <select
              value={stockStatus}
              onChange={(event) => {
                setStockStatus(event.target.value);
                resetPage();
              }}
              className="rounded-xl border border-white/15 bg-white/[0.08] px-3 py-3 text-sm outline-none transition focus:border-indigo-400"
            >
              {stockOptions.map((option) => (
                <option
                  key={option}
                  value={option}
                  className="text-slate-900"
                >
                  {option}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value);
                resetPage();
              }}
              className="rounded-xl border border-white/15 bg-white/[0.08] px-3 py-3 text-sm outline-none transition focus:border-indigo-400"
            >
              {sortOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="text-slate-900"
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </section>

        {categoryLoadError && (
          <p role="alert" className="mt-3 text-sm text-rose-200">
            Unable to load category filters: {categoryLoadError}
          </p>
        )}

        {error && (
          <p className="mt-5 rounded-xl bg-rose-500/15 p-4 text-sm text-rose-200">
            {error}
          </p>
        )}

        <section className="mt-6">
          {loading ? (
            <ProductsTableSkeleton />
          ) : visibleProducts.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.09] p-12 text-center">
              <PackageSearch className="mx-auto" size={32} />

              <h2 className="mt-4 text-xl font-semibold">
                No products found
              </h2>

              <p className="mt-2 text-sm text-white/60">
                Try changing your search or filter options.
              </p>
            </div>
          ) : (
            <>
              <ProductTable
                products={visibleProducts}
                getActions={getActions}
              />

              <div className="space-y-4 md:hidden">
                {visibleProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    actions={getActions(product)}
                  />
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm text-white/65">
                  Page {page} of {totalPages}
                </span>

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() =>
                      setPage((currentPage) => currentPage - 1)
                    }
                    className="rounded-lg border border-white/15 px-3 py-2 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    disabled={page === totalPages}
                    onClick={() =>
                      setPage((currentPage) => currentPage + 1)
                    }
                    className="rounded-lg border border-white/15 px-3 py-2 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      <DeleteProductModal
        product={selectedProduct}
        isDeleting={deleting}
        onClose={() => setSelectedProduct(null)}
        onConfirm={handleDelete}
      />
    </main>
  );
}

export default Products;
