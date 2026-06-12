import apiClient from "./apiClient";

// ─── Booth Service ────────────────────────────────────────────
// Phục vụ: BoothManagementPage, AdminDashboardPage
// API: /api/booths

const boothService = {
  /**
   * Lấy danh sách gian hàng (phân trang + filter)
   * @param {{ page?, pageSize?, eventId?, categoryId?, search? }} params
   * @returns {{ items: Booth[], total: number, active: number }}
   */
  getAll: ({ page = 1, pageSize = 10, eventId = "", categoryId = "", search = "" } = {}) => {
    const q = new URLSearchParams();
    q.set("page",     page);
    q.set("pageSize", pageSize);
    if (eventId)    q.set("eventId",    eventId);
    if (categoryId) q.set("categoryId", categoryId);
    if (search)     q.set("search",     search);
    return apiClient.get(`/booths?${q}`);
  },

  /**
   * Lấy chi tiết 1 gian hàng (kèm media + narration)
   * @param {string|number} id
   * @returns {Booth}
   */
  getById: (id) =>
    apiClient.get(`/booths/${id}`),

  /**
   * Tạo gian hàng mới
   * @param {{ eventId, vendorId, categoryId, name, description, latitude, longitude, geofenceRadius }} data
   * @returns {Booth}
   */
  create: (data) =>
    apiClient.post("/booths", data),

  /**
   * Cập nhật gian hàng
   * @param {string|number} id
   * @param {Partial<Booth>} data
   * @returns {Booth}
   */
  update: (id, data) =>
    apiClient.put(`/booths/${id}`, data),

  /**
   * Xóa gian hàng
   * @param {string|number} id
   */
  delete: (id) =>
    apiClient.delete(`/booths/${id}`),

  /**
   * Lấy QR Code URL của gian hàng
   * @param {string|number} id
   * @returns {{ qrCodeUrl: string }}
   */
  getQRCode: (id) =>
    apiClient.get(`/booths/${id}/qrcode`),

  /**
   * Tìm gian hàng gần nhất theo tọa độ GPS (dùng cho visitor)
   * @param {{ lat: number, lng: number, eventId: string, radius?: number }} params
   * @returns {{ boothId, boothName, distance }}
   */
  findNearest: ({ lat, lng, eventId, radius }) => {
    const q = new URLSearchParams({ lat, lng, eventId });
    if (radius) q.set("radius", radius);
    return apiClient.get(`/booths/nearest?${q}`);
  },
};

export default boothService;