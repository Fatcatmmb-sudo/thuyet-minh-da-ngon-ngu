import apiClient from "./apiClient";

// ─── Auth Service ─────────────────────────────────────────────
// Phục vụ: LoginPage
// API: POST /api/auth/login

const authService = {
  /**
   * Đăng nhập
   * @param {{ username: string, password: string }} credentials
   * @returns {{ token: string, role: string, accountId: number }}
   */
  login: (credentials) =>
    apiClient.post("/auth/login", credentials),

  /**
   * Đăng xuất — xóa token local (backend stateless JWT không cần gọi API)
   */
  logout: () => {
    localStorage.removeItem("token");
  },

  /**
   * Lấy thông tin user hiện tại từ JWT payload (không gọi API)
   * @returns {{ accountId, username, role } | null}
   */
  getCurrentUser: () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        return null;
      }
      return {
        accountId: payload.accountId || payload.sub,
        username:  payload.username,
        role:      payload.role,
      };
    } catch {
      return null;
    }
  },
};

export default authService;