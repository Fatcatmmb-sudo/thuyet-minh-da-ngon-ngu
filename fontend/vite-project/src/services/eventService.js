import apiClient from "./apiClient";

// ─── Event Service ────────────────────────────────────────────
// Phục vụ: AdminDashboardPage, BoothManagementPage, EventManagementPage
// API: /api/events

const eventService = {
  /**
   * Lấy danh sách sự kiện (có phân trang + tìm kiếm)
   * @param {{ page?, pageSize?, search?, status? }} params
   * @returns {{ items: Event[], total: number }}
   */
  getAll: ({ page = 1, pageSize = 10, search = "", status = "" } = {}) => {
    const q = new URLSearchParams();
    q.set("page",     page);
    q.set("pageSize", pageSize);
    if (search) q.set("search", search);
    if (status) q.set("status", status);
    return apiClient.get(`/events?${q}`);
  },

  /**
   * Lấy 1 sự kiện theo ID
   * @param {string|number} id
   * @returns {Event}
   */
  getById: (id) =>
    apiClient.get(`/events/${id}`),

  /**
   * Tạo sự kiện mới
   * @param {{ name, description, location, startDate, endDate, logoUrl? }} data
   * @returns {Event}
   */
  create: (data) =>
    apiClient.post("/events", data),

  /**
   * Cập nhật sự kiện
   * @param {string|number} id
   * @param {Partial<Event>} data
   * @returns {Event}
   */
  update: (id, data) =>
    apiClient.put(`/events/${id}`, data),

  /**
   * Xóa sự kiện
   * @param {string|number} id
   */
  delete: (id) =>
    apiClient.delete(`/events/${id}`),

  /**
   * Lấy danh sách booth theo sự kiện (dùng cho bản đồ visitor)
   * @param {string|number} eventId
   * @returns {Booth[]}
   */
  getBooths: (eventId) =>
    apiClient.get(`/events/${eventId}/booths`),
};

export default eventService;