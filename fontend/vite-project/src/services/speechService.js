import apiClient from "./apiClient";

// ─── Speech Service ───────────────────────────────────────────
// Gọi Azure Cognitive Speech để tổng hợp giọng nói (TTS)
// Dùng tại: V4 – Trang thuyết minh gian hàng (/booth/:boothId)

const speechService = {
  /**
   * Tạo audio TTS từ nội dung văn bản
   * Backend chọn voice phù hợp theo languageCode:
   *   vi → vi-VN-HoaiMyNeural
   *   en → en-US-JennyNeural
   *   ja → ja-JP-NanamiNeural
   *   ko → ko-KR-SunHiNeural
   *   zh → zh-CN-XiaoxiaoNeural
   *
   * @param {string} text          - Nội dung cần đọc
   * @param {string} languageCode  - "vi" | "en" | "ja" | "ko" | "zh"
   * Returns: { audioUrl: string } - URL file MP3 để frontend phát
   */
  generateAudio: (text, languageCode) =>
    apiClient.post("/speech/generate", { text, languageCode }),
};

export default speechService;