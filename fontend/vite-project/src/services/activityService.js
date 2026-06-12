import apiClient from "./apiClient";

// ─── Activity Service ─────────────────────────────────────────
// Lấy danh sách hoạt động gần đây cho Admin Dashboard
// Dùng tại: A2 – Dashboard Admin (/admin/dashboard)
// TODO: Cần backend tạo endpoint /admin/activity trước khi dùng

const activityService = {
  /**
   * Lấy danh sách hoạt động gần đây
   * @param {number} limit - số lượng muốn lấy (mặc định 5)
   * Returns: [{ id, text, sub, time, color }]
   *   - text  : mô tả hoạt động (vd: "Gian hàng VinAI vừa được tạo")
   *   - sub   : thông tin phụ (vd: "Tech Expo 2025")
   *   - time  : thời gian (vd: "5 phút trước")
   *   - color : màu dot "blue" | "green" | "red" | "purple"
   */
  getRecent: (limit = 5) =>
    apiClient.get(`/admin/activity?limit=${limit}`),
};

export default activityService;