import { Menu, PackageCheck } from "lucide-react";

function Navbar({ onMenuToggle }) {
  return (
    <header className="relative z-20 flex items-center justify-between border-b border-white/10 bg-[#160b2a]/90 px-4 py-3 text-white backdrop-blur-md lg:hidden">
      <div className="flex items-center gap-3">
        <span className="rounded-xl border border-white/15 bg-indigo-300/15 p-2 text-indigo-100">
          <PackageCheck size={19} />
        </span>
        <div>
          <p className="text-sm font-semibold">Stockroom</p>
          <p className="text-xs text-white/55">Inventory management</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onMenuToggle}
        className="rounded-xl border border-white/15 p-2.5 text-white/90 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-200/70"
        aria-label="Open navigation menu"
      >
        <Menu size={20} />
      </button>
    </header>
  );
}

export default Navbar;
