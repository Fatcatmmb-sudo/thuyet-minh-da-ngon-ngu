import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// Hỗ trợ tất cả các ngôn ngữ phổ biến
const LANGUAGE_DICTS = {
  vi: { welcome: "Chào mừng bạn đến với sự kiện", start: "Bắt đầu tham quan 🚀", map: "Xem bản đồ 🗺️", select: "Chọn ngôn ngữ:" },
  en: { welcome: "Welcome to the Event", start: "Start Tour 🚀", map: "View Map 🗺️", select: "Select Language:" },
  ja: { welcome: "イベントへようこそ", start: "ツアー bắt đầu 🚀", map: "地図を見る 🗺️", select: "言語選択:" },
  zh: { welcome: "欢迎光临活动", start: "开始参观 🚀", map: "查看地图 🗺️", select: "选择语言:" }
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("event") || "EVT001";
  
  const [lang, setLang] = useState("vi");
  const [eventInfo, setEventInfo] = useState({ logo: "🎪", name: "Đang tải...", location: "...", date: "..." });

  useEffect(() => {
    // 1. Tự động detect ngôn ngữ hệ thống từ trình duyệt
    const browserLang = navigator.language.split("-")[0];
    if (LANGUAGE_DICTS[browserLang]) setLang(browserLang);

    // 2. Giả lập Gọi GET /api/events/:id
    setTimeout(() => {
      setEventInfo({
        logo: "🍔",
        name: "Lễ Hội Ẩm Thực Đa Quốc Gia 2026",
        location: "Công viên Tao Đàn, Quận 1, TP.HCM",
        date: "15/06/2026 - 20/06/2026"
      });
    }, 300);
  }, [eventId]);

  const t = LANGUAGE_DICTS[lang] || LANGUAGE_DICTS["en"];

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{ fontSize: 60 }}>{eventInfo.logo}</div>
        <h2 style={{ margin: "10px 0" }}>{eventInfo.name}</h2>
        <p style={{ color: "#666", fontSize: 14 }}>📍 {eventInfo.location}</p>
        <p style={{ color: "#999", fontSize: 13 }}>📅 {eventInfo.date}</p>

        <hr style={{ margin: "20px 0", border: "0.5px solid #eee" }} />

        <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>{t.select}</label>
        <select value={lang} onChange={(e) => setLang(e.target.value)} style={styles.select}>
          <option value="vi">🇻🇳 Tiếng Việt</option>
          <option value="en">🇬🇧 English</option>
          <option value="ja">🇯🇵 日本語</option>
          <option value="zh">🇨🇳 中文</option>
        </select>

        <button onClick={() => navigate(`/location?lang=${lang}&event=${eventId}`)} style={styles.btnPrimary}>
          {t.start}
        </button>
        <button onClick={() => navigate(`/map?event=${eventId}&lang=${lang}`)} style={styles.btnSecondary}>
          {t.map}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f5f7fb", padding: 15, fontFamily: "sans-serif" },
  card: { backgroundColor: "#fff", padding: 25, borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", maxWidth: 400, width: "100%", textAlign: "center" },
  select: { width: "100%", padding: 12, borderRadius: 8, border: "1px solid #ccc", marginBottom: 20, fontSize: 15 },
  btnPrimary: { width: "100%", padding: 14, backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: 8, fontSize: 16, fontWeight: "bold", cursor: "pointer", marginBottom: 10 },
  btnSecondary: { width: "100%", padding: 14, backgroundColor: "#6c757d", color: "#fff", border: "none", borderRadius: 8, fontSize: 16, fontWeight: "bold", cursor: "pointer" }
};