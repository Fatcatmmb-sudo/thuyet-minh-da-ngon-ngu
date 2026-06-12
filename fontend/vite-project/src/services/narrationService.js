import apiClient from "./apiClient";

// ─── Narration Service ────────────────────────────────────────
// Quản lý nội dung thuyết minh gốc (tiếng Việt) của gian hàng
// Dùng tại:
//   - VD2 – Quản lý nội dung thuyết minh (/vendor/narrations/:boothId)
//   - V4  – Trang thuyết minh gian hàng (/booth/:boothId)

const narrationService = {
  /**
   * Lấy nội dung thuyết minh gốc của gian hàng
   * @param {string|number} boothId
   * Returns: { id, boothId, title, content, updatedAt }
   */
  getByBoothId: (boothId) =>
    apiClient.get(`/narrations/${boothId}`),

  /**
   * Vendor cập nhật nội dung thuyết minh gốc
   * @param {string|number} narrationId
   * @param {{ title: string, content: string }} data
   */
  update: (narrationId, data) =>
    apiClient.put(`/narrations/${narrationId}`, data),

  /**
   * Lấy bản dịch theo ngôn ngữ
   * Nếu chưa có bản dịch → backend tự kích hoạt dịch qua Azure OpenAI
   * @param {string|number} narrationId
   * @param {string} lang - "vi" | "en" | "ja" | "ko" | "zh"
   * Returns: { languageCode, translatedTitle, translatedContent, isManuallyEdited }
   */
  getTranslation: (narrationId, lang) =>
    apiClient.get(`/narrations/${narrationId}/translation?lang=${lang}`),
};

export default narrationService;