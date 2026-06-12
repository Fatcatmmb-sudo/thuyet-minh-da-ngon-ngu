import apiClient from "./apiClient";

// ─── Media Service ────────────────────────────────────────────
// Quản lý ảnh và video cho gian hàng
// Dùng tại: VD3 – Upload hình ảnh / video (/vendor/media/:boothId)

const mediaService = {
  // ── Hình ảnh ──────────────────────────────────────────────

  /**
   * Lấy danh sách ảnh của gian hàng
   * @param {string|number} boothId
   * Returns: [{ id, filePath, caption, sortOrder, createdAt }]
   */
  getImages: (boothId) =>
    apiClient.get(`/booths/${boothId}/images`),

  /**
   * Upload ảnh mới (multipart/form-data)
   * @param {FormData} formData - chứa file + boothId + caption
   * Returns: { id, filePath, caption, sortOrder }
   */
  uploadImage: (formData) =>
    apiClient.post("/images", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  /**
   * Cập nhật caption của ảnh
   * @param {string|number} imageId
   * @param {string} caption
   */
  updateImageCaption: (imageId, caption) =>
    apiClient.put(`/images/${imageId}`, { caption }),

  /**
   * Xóa ảnh (xóa cả file vật lý lẫn DB)
   * @param {string|number} imageId
   */
  deleteImage: (imageId) =>
    apiClient.delete(`/images/${imageId}`),

  // ── Video ─────────────────────────────────────────────────

  /**
   * Lấy danh sách video của gian hàng
   * @param {string|number} boothId
   * Returns: [{ id, videoUrl, title, createdAt }]
   */
  getVideos: (boothId) =>
    apiClient.get(`/booths/${boothId}/videos`),

  /**
   * Thêm URL video YouTube / Vimeo
   * @param {string|number} boothId
   * @param {string} videoUrl
   * @param {string} title
   */
  addVideo: (boothId, videoUrl, title) =>
    apiClient.post("/videos", { boothId, videoUrl, title }),

  /**
   * Xóa video
   * @param {string|number} videoId
   */
  deleteVideo: (videoId) =>
    apiClient.delete(`/videos/${videoId}`),
};

export default mediaService;