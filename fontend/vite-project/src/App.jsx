import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

// ── Admin pages ──────────────────────────────────────────────
import DashboardPage         from "./pages/admin/DashboardPage";
import EventManagementPage   from "./pages/admin/EventManagementPage";
import BoothManagementPage   from "./pages/admin/BoothManagementPage";
import AccountManagementPage from "./pages/admin/AccountManagementPage";
import ReportPage            from "./pages/admin/ReportPage";
import LoginPage             from "./pages/admin/LoginPage";

// ── Vendor pages (thêm sau) ───────────────────────────────────
// import VendorDashboardPage from "./pages/vendor/VendorDashboardPage";

// ── Visitor pages (thêm sau) ──────────────────────────────────
// import LandingPage from "./pages/visitor/LandingPage";
// import MapPage     from "./pages/visitor/MapPage";
// import BoothPage   from "./pages/visitor/BoothPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public ─────────────────────────────────────── */}
        <Route path="/login" element={<LoginPage />} />

        {/* ── Admin (chỉ role Admin mới vào được) ────────── */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <Navigate to="/admin/dashboard" replace />
          </ProtectedRoute>
        } />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/events" element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <EventManagementPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/booths" element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <BoothManagementPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/accounts" element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AccountManagementPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/reports" element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <ReportPage />
          </ProtectedRoute>
        } />

        {/* ── Vendor (thêm sau) ───────────────────────────── */}
        {/* <Route path="/vendor/*" element={<ProtectedRoute allowedRoles={["Vendor"]}><VendorDashboardPage /></ProtectedRoute>} /> */}

        {/* ── Fallback ────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}