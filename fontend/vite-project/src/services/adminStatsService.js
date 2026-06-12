import apiClient from "./apiClient";

// Service dành riêng cho Admin Dashboard
// Gọi các endpoint: /api/admin/stats/*

const adminStatsService = {
  /**
   * Lấy số liệu tổng quan (stat cards)
   * Returns: { events, eventsDelta, booths, boothsDelta, listensToday, listensDelta }
   */
  getSummary: () => apiClient.get("/admin/stats/summary"),

  /**
   * Lấy dữ liệu biểu đồ lượt nghe
   * @param {string} range - "7d" | "30d" | "today"
   * Returns: { labels: string[], values: number[] }
   *       hoặc [{ day, value }] tuỳ backend
   */
  getChart: (range = "7d") => apiClient.get(`/admin/stats/chart?range=${range}`),

  /**
   * Lấy top gian hàng theo lượt nghe hôm nay
   * @param {number} limit - số lượng muốn lấy (mặc định 5)
   * Returns: [{ id, name, event, visits, pct }]
   */
  getTopBooths: (limit = 5) =>
    apiClient.get(`/admin/stats/top-booths?date=today&limit=${limit}`),
};

export default adminStatsService;