import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "./Layout.css";

/**
 * Props:
 *  - children : ReactNode
 *
 * Đọc user/role từ localStorage JWT (giống useAuth hook).
 * Dùng bọc tất cả trang Admin và Vendor.
 */
export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Lấy thông tin user từ JWT trong localStorage
  const user = (() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        username: payload.username || payload.sub || "Admin",
        role: payload.role || "Admin",
      };
    } catch {
      return { username: "Admin", role: "Admin" };
    }
  })();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="layout">
      <Navbar
        user={user}
        onLogout={handleLogout}
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
      />

      <div className="layout__body">
        <Sidebar
          role={user?.role ?? "Admin"}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="layout__main">
          {children}
        </main>
      </div>
    </div>
  );
}