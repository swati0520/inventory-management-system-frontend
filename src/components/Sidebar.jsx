import { LayoutDashboard, LogOut, PackageCheck, Tags, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { clearAuthToken } from "../utils/auth";

const navigationItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard, end: true },
  { label: "Products", to: "/products", icon: PackageCheck, end: true },
  { label: "Categories", to: "/categories", icon: Tags, end: true },
];

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthToken();
    navigate("/login", { replace: true });
  };

  const navLinkClassName = ({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
    isActive
      ? "bg-gradient-to-r from-[#56052e]/90 via-[#61285e]/90 to-[#5d75dc]/90 text-white shadow-lg shadow-indigo-950/25"
      : "text-white/70 hover:bg-white/[0.09] hover:text-white"
  }`;

  return (
    <>
      {isOpen && <button type="button" className="fixed inset-0 z-30 bg-[#160b2a]/70 backdrop-blur-sm lg:hidden" aria-label="Close navigation menu" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/10 bg-[#1c0e34]/95 p-4 text-white shadow-2xl shadow-black/30 backdrop-blur-xl transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:shadow-none ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between gap-3 px-2 py-2">
          <div className="flex items-center gap-3">
            <span className="rounded-xl border border-white/15 bg-indigo-300/15 p-2.5 text-indigo-100">
              <PackageCheck size={21} />
            </span>
            <div>
              <p className="font-semibold tracking-tight">Stockroom</p>
              <p className="text-xs text-white/55">Inventory management</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-white/65 transition hover:bg-white/10 hover:text-white lg:hidden" aria-label="Close navigation menu">
            <X size={19} />
          </button>
        </div>

        <nav className="mt-8 space-y-1" aria-label="Main navigation">
          {navigationItems.map(({ icon: Icon, label, to, end }) => (
            <NavLink key={to} to={to} end={end} onClick={onClose} className={navLinkClassName}>
              <Icon size={19} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-white/10 pt-4">
          <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-white/70 transition hover:bg-rose-300/10 hover:text-rose-100">
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
