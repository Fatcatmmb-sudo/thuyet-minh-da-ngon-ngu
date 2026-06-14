import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import "./LoginPage.css";

// ─── Icons ────────────────────────────────────────────────────
const IconUser = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconLock = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconEye = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconEyeOff = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const IconMic = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4z" opacity="0.9"/>
    <path d="M19 10a7 7 0 0 1-14 0H3a9 9 0 0 0 8 8.94V21H9v2h6v-2h-2v-2.06A9 9 0 0 0 21 10h-2z" opacity="0.7"/>
  </svg>
);

// ─── Main Page ────────────────────────────────────────────────
export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember]         = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");

  // ── Xử lý thay đổi input ───────────────────────────────────
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  }

  // ── Submit đăng nhập ───────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.username.trim()) { setError("Vui lòng nhập tên đăng nhập."); return; }
    if (!form.password)        { setError("Vui lòng nhập mật khẩu.");      return; }

    setLoading(true);
    setError("");

    try {
      const res = await authService.login({ username: form.username.trim(), password: form.password });

      // Lưu token — remember = localStorage, không remember = sessionStorage
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem("token", res.token);
      storage.setItem("role",  res.role);
      storage.setItem("accountId", String(res.accountId));

      // Redirect theo role
      if (res.role === "Admin")  navigate("/admin/dashboard");
      else                       navigate("/vendor/dashboard");

    } catch (err) {
      const msg = err.response?.data?.message || err.message || "";
      if (msg.toLowerCase().includes("lock") || msg.toLowerCase().includes("khóa")) {
        setError("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.");
      } else {
        setError("Tên đăng nhập hoặc mật khẩu không đúng.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="lp-page">

      {/* ── Decorative background blobs ── */}
      <div className="lp-blob lp-blob--1" />
      <div className="lp-blob lp-blob--2" />

      {/* ── Card đăng nhập ── */}
      <div className="lp-card">

        {/* Logo + tiêu đề */}
        <div className="lp-brand">
          <div className="lp-brand__icon">
            <IconMic />
          </div>
          <h1 className="lp-brand__name">AutoNarration</h1>
          <p className="lp-brand__sub">Admin Portal</p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="lp-error">
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form className="lp-form" onSubmit={handleSubmit}>

          {/* Username */}
          <div className={`lp-field ${error ? "lp-field--error" : ""}`}>
            <label htmlFor="username">Tên đăng nhập</label>
            <div className="lp-input-wrap">
              <span className="lp-input-icon"><IconUser /></span>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="Nhập tên đăng nhập..."
                value={form.username}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className={`lp-field ${error ? "lp-field--error" : ""}`}>
            <label htmlFor="password">Mật khẩu</label>
            <div className="lp-input-wrap">
              <span className="lp-input-icon"><IconLock /></span>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Nhập mật khẩu..."
                value={form.password}
                onChange={handleChange}
                disabled={loading}
              />
              <button
                type="button"
                className="lp-eye-btn"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="lp-row">
            <label className="lp-checkbox">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>Ghi nhớ đăng nhập</span>
            </label>
            <button type="button" className="lp-forgot">
              Quên mật khẩu?
            </button>
          </div>

          {/* Submit */}
          <button type="submit" className="lp-submit" disabled={loading}>
            {loading ? (
              <span className="lp-spinner" />
            ) : (
              "Đăng nhập"
            )}
          </button>

        </form>

        <p className="lp-footer">Hệ thống Thuyết Minh Tự Động Đa Ngôn Ngữ</p>
      </div>
    </div>
  );
}