import {
  AlertTriangle,
  ArchiveX,
  Boxes,
  FolderTree,
  PackageCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import { getDashboardStats } from "../services/dashboardService";
import { getProducts } from "../services/productService";
import { getCategories } from "../services/categoryService";

const statCards = [
  {
    title: "Total Products",
    key: "totalProducts",
    icon: PackageCheck,
    iconClassName: "bg-indigo-300/20 text-indigo-100",
  },
  {
    title: "Total Categories",
    key: "totalCategories",
    icon: FolderTree,
    iconClassName: "bg-violet-300/20 text-violet-100",
  },
  {
    title: "Total Stock Quantity",
    key: "totalStockQuantity",
    icon: Boxes,
    iconClassName: "bg-sky-300/20 text-sky-100",
  },
  {
    title: "Low Stock Items",
    key: "lowStockItems",
    icon: AlertTriangle,
    iconClassName: "bg-amber-300/20 text-amber-100",
  },
  {
    title: "Out of Stock Items",
    key: "outOfStockItems",
    icon: ArchiveX,
    iconClassName: "bg-rose-300/20 text-rose-100",
  },
];

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getDashboardStats();

      // Backend response: { success, message, data: {...} }
      setStats(response.data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Failed to load dashboard statistics."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalProducts = async () => {
    try {
      const response = await getProducts();

      // Backend response: { success, message, data: [...] }
      setProducts(response.data || []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Failed to load products."
      );
    }
  };

  const getTotalCategory = async () => {
    try {
      const response = await getCategories();

      // Backend response: { success, message, data: [...] }
      setCategories(response.data || []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Failed to load categories."
      );
    }
  };

  useEffect(() => {
    loadStats();
    getTotalProducts();
    getTotalCategory();
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#160b2a] px-4 py-8 font-sans text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#8b263d_0%,transparent_38%),radial-gradient(circle_at_92%_86%,#4767c8_0%,transparent_34%),radial-gradient(circle_at_5%_92%,#763a51_0%,transparent_36%)]" />

      <div className="relative mx-auto max-w-7xl">
        <header className="mb-8 rounded-2xl border border-white/10 bg-white/[0.09] px-6 py-6 shadow-xl shadow-black/15 backdrop-blur-md sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-200">
              Dashboard
            </p>
          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Inventory Overview
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
            Monitor your products, categories, and stock levels at a glance.
          </p>

          {error && (
            <div className="mt-3 flex items-center justify-between gap-4 rounded-xl border border-rose-200/20 bg-rose-300/15 px-4 py-3 text-sm text-rose-100">
              <span>{error}</span>

              <button
                type="button"
                onClick={() => {
                  loadStats();
                  getTotalProducts();
                  getTotalCategory();
                }}
                className="font-semibold underline underline-offset-4"
              >
                Retry
              </button>
            </div>
          )}
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {statCards.map((card) => (
            <StatCard
              key={card.key}
              title={card.title}
              value={
                isLoading
                  ? "…"
                  : card.key === "totalProducts"
                    ? products.length
                    : card.key === "totalCategories"
                      ? categories.length
                      : stats?.[card.key] ?? "—"
              }
              icon={card.icon}
              iconClassName={card.iconClassName}
            />
          ))}
        </section>
      </div>
    </main>
  );
}

export default Dashboard;