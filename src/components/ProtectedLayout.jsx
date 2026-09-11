import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function ProtectedLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-[#160b2a]">
      <Navbar onMenuToggle={() => setIsSidebarOpen(true)} />
      <div className="lg:flex">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default ProtectedLayout;
