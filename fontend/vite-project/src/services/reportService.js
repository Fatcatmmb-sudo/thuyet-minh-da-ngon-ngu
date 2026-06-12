import apiClient from "./apiClient";

// ─── Report Service ───────────────────────────────────────────
// Phục vụ: AdminDashboardPage, ReportPage
// API: /api/admin/stats  +  /api/reports

const reportService = {
  // ── Dùng cho Dashboard ──────────────────────────────────────

  /**
   * Lấy số liệu tổng quan (stat cards)
   * @returns {{ events: number, booths: number, listensToday: number,
   *             eventsDelta: string, boothsDelta: string, listensDelta: string }}
   */
  getSummary: () =>
    apiClient.get("/admin/stats/summary"),

  /**
   * Lấy dữ liệu biểu đồ lượt nghe theo ngày
   * @param {"7d"|"30d"} range
   * @returns {{ labels: string[], values: number[] }}
   */
  getChart: (range = "7d") =>
    apiClient.get(`/admin/stats/chart?range=${range}`),

  /**
   * Top gian hàng được nghe nhiều nhất hôm nay
   * @param {number} limit
   * @returns {{ id, name, event, visits, pct }[]}
   */
  getTopBooths: (limit = 5) =>
    apiClient.get(`/admin/stats/top-booths?limit=${limit}`),

  // ── Dùng cho ReportPage ─────────────────────────────────────

  /**
   * Tổng hợp báo cáo theo sự kiện + thời gian
   * @param {{ eventId, range }} params
   */
  getReportSummary: ({ eventId, range = "week" }) => {
    const q = new URLSearchParams({ eventId, range });
    return apiClient.get(`/reports/summary?${q}`);
  },

  /**
   * Dữ liệu biểu đồ theo ngày cho ReportPage
   */
  getReportChart: ({ eventId, range = "week" }) => {
    const q = new URLSearchParams({ eventId, range });
    return apiClient.get(`/reports/chart?${q}`);
  },

  /**
   * Thống kê theo ngôn ngữ
   */
  getByLanguage: (eventId) =>
    apiClient.get(`/reports/by-language?eventId=${eventId}`),

  /**
   * Thống kê theo thiết bị
   */
  getByDevice: (eventId) =>
    apiClient.get(`/reports/by-device?eventId=${eventId}`),

  /**
   * Thống kê chi tiết từng gian hàng
   */
  getByBooth: (eventId) =>
    apiClient.get(`/reports/by-booth?eventId=${eventId}`),

  /**
   * Export Excel — trả về blob URL
   */
  exportExcel: ({ eventId, range }) => {
    const q = new URLSearchParams({ eventId, range });
    return apiClient.get(`/reports/export?${q}`);
  },
};

export default reportService;