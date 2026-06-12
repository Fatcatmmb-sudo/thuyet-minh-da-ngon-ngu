import apiClient from "./apiClient";

// ─── Account Service ──────────────────────────────────────────
// Phục vụ: AccountManagementPage
// API: /api/accounts

const accountService = {
  /**
   * Lấy danh sách tài khoản (phân trang + filter role/status)
   * @param {{ page?, pageSize?, role?, status?, search? }} params
   * @returns {{ items: Account[], total: number }}
   */
  getAll: ({ page = 1, pageSize = 10, role = "", status = "", search = "" } = {}) => {
    const q = new URLSearchParams();
    q.set("page",     page);
    q.set("pageSize", pageSize);
    if (role)   q.set("role",   role);
    if (status) q.set("status", status);
    if (search) q.set("search", search);
    return apiClient.get(`/accounts?${q}`);
  },

  /**
   * Tạo tài khoản mới (kèm thông tin vendor nếu role = Vendor)
   * @param {{ username, email, role, company?, representative?, phone? }} data
   * @returns {Account}
   */
  create: (data) =>
    apiClient.post("/accounts", data),

  /**
   * Cập nhật thông tin tài khoản
   * @param {string|number} id
   * @param {Partial<Account>} data
   * @returns {Account}
   */
  update: (id, data) =>
    apiClient.put(`/accounts/${id}`, data),

  /**
   * Khóa hoặc mở tài khoản
   * @param {string|number} id
   * @param {"active"|"inactive"} status
   * @returns {Account}
   */
  setStatus: (id, status) =>
    apiClient.patch(`/accounts/${id}/status`, { status }),

  /**
   * Reset mật khẩu → backend tự sinh + gửi email
   * @param {string|number} id
   */
  resetPassword: (id) =>
    apiClient.post(`/accounts/${id}/reset-password`),
};

export default accountService;