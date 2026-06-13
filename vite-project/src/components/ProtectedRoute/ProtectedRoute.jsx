import { Navigate, useLocation } from "react-router-dom";

// ─── Helpers ──────────────────────────────────────────────────
/** Đọc và validate JWT từ localStorage */
function getAuthInfo() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const payload = JSON.parse(atob(token.split(".")[1]));

    // Kiểm tra hết hạn
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return null;
    }

    return {
      token,
      role: payload.role,          // "Admin" | "Vendor"
      accountId: payload.accountId || payload.sub,
      username: payload.username,
    };
  } catch {
    localStorage.removeItem("token");
    return null;
  }
}

// ─── Component ────────────────────────────────────────────────
/**
 * Props:
 *  - children    : ReactNode
 *  - allowedRoles: string[]   — VD: ["Admin"] hoặc ["Admin", "Vendor"]
 *
 * Hành vi:
 *  - Chưa đăng nhập          → redirect /login (giữ lại location để redirect lại sau)
 *  - Đăng nhập nhưng sai role → redirect về dashboard của role đó
 *  - Đúng role               → render children
 *
 * Dùng:
 *   <Route path="/admin/*" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminLayout /></ProtectedRoute>} />
 *   <Route path="/vendor/*" element={<ProtectedRoute allowedRoles={["Vendor"]}><VendorLayout /></ProtectedRoute>} />
 */
export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const location = useLocation();
  const auth = getAuthInfo();

  // ── Chưa đăng nhập ──────────────────────────────────────────
  if (!auth) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // ── Sai role ─────────────────────────────────────────────────
  if (allowedRoles.length > 0 && !allowedRoles.includes(auth.role)) {
    const fallback = auth.role === "Admin"
      ? "/admin/dashboard"
      : "/vendor/dashboard";
    return <Navigate to={fallback} replace />;
  }

  // ── OK ───────────────────────────────────────────────────────
  return children;
}

// ─── Export helper hook (optional, tiện dùng ở các page) ──────
/**
 * Hook trả về thông tin user hiện tại từ JWT.
 * Dùng: const { role, username, accountId } = useAuth();
 */
export function useAuth() {
  return getAuthInfo();
}