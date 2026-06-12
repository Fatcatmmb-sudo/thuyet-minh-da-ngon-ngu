import apiClient from "./apiClient";

// ─── Vendor Service ───────────────────────────────────────────
// Lấy dữ liệu riêng của vendor đang đăng nhập
// Dùng tại:
//   - VD1 – Dashboard Vendor (/vendor/dashboard)
//   - VD4 – Thống kê gian hàng (/vendor/stats/:boothId)

const vendorService = {
  /**
   * Lấy thông tin vendor hiện tại (từ JWT)
   * Returns: { id, accountId, companyName, representativeName, phoneNumber }
   */
  getMe: () =>
    apiClient.get("/vendor/me"),

  /**
   * Lấy danh sách booth của vendor (chỉ booth thuộc vendor đó)
   * Returns: [{ id, name, eventName, isActive, listensToday }]
   */
  getMyBooths: () =>
    apiClient.get("/vendor/booths"),

  /**
   * Lấy thống kê tổng hôm nay của vendor
   * Returns: { totalBooths, listensToday, totalLanguages }
   */
  getStatsToday: () =>
    apiClient.get("/vendor/stats/today"),

  /**
   * Lấy thống kê tổng hợp của một booth
   * @param {string|number} boothId
   * @param {string} range - "7d" | "30d" | "month"
   * Returns: { totalListens, avgDuration, topLanguage }
   */
  getBoothStats: (boothId, range = "7d") =>
    apiClient.get(`/vendor/stats/${boothId}?range=${range}`),

  /**
   * Lấy phân phối lượt nghe theo giờ trong ngày
   * @param {string|number} boothId
   * Returns: [{ hour: number, count: number }] (24 phần tử)
   */
  getBoothHourly: (boothId) =>
    apiClient.get(`/vendor/stats/${boothId}/hourly`),

  /**
   * Lấy tỷ lệ ngôn ngữ của một booth
   * @param {string|number} boothId
   * Returns: [{ languageCode: string, count: number, pct: number }]
   */
  getBoothLanguages: (boothId) =>
    apiClient.get(`/vendor/stats/${boothId}/languages`),
};

export default vendorService;