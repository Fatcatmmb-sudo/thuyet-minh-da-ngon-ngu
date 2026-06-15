import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function LocationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") || "vi";
  const eventId = searchParams.get("event") || "EVT001";

  const [status, setStatus] = useState("Đang xin quyền truy cập định vị GPS...");
  const [showManual, setShowManual] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("Trình duyệt không hỗ trợ định vị GPS.");
      setShowManual(true);
      return;
    }

    // Gọi theo yêu cầu: navigator.geolocation.watchPosition()
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setStatus("📍 Đã lấy vị trí thành công! Đang tìm gian hàng gần nhất...");
        
        // Giả lập gọi POST /api/booths/nearest gửi tọa độ lên
        setTimeout(() => {
          const mockNearestBoothId = "BTH001"; // Giả lập tìm được booth gần nhất
          navigate(`/booth/${mockNearestBoothId}?lang=${lang}&event=${eventId}`);
        }, 1500);
      },
      (error) => {
        setStatus("❌ Bạn đã từ chối hoặc định vị GPS thất bại.");
        setShowManual(true);
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{ fontSize: 40, marginBottom: 15 }}>📡</div>
        <p style={{ fontSize: 16, lineHeight: "1.5", color: "#333" }}>{status}</p>
        
        {showManual && (
          <div style={{ marginTop: 20 }}>
            <p style={{ fontSize: 13, color: "#666" }}>Vui lòng bật định vị hoặc chọn đi tới bản đồ tổng quan:</p>
            <button onClick={() => navigate(`/map?event=${eventId}&lang=${lang}`)} style={styles.btn}>
              Đi tới Bản Đồ Thủ Công 🗺️
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#eef2f5", padding: 15, fontFamily: "sans-serif" },
  card: { backgroundColor: "#fff", padding: 30, borderRadius: 12, textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", maxWidth: 360 },
  btn: { width: "100%", padding: 12, backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: "bold", marginTop: 10, cursor: "pointer" }
};