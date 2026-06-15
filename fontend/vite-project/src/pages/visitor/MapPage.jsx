import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// Công thức toán Haversine tính khoảng cách giữa 2 điểm GPS (Trả về mét)
function getHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Bán kính Trái Đất theo mét
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
}

export default function MapPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("event") || "EVT001";
  const lang = searchParams.get("lang") || "vi";

  // Vị trí người dùng (Marker xanh giả lập)
  const userLoc = { lat: 10.7766, lon: 106.6926 };

  // Danh sách các Booth trong Sự kiện
  const initialBooths = [
    { id: "BTH001", name: "Gian Hàng Phở Hà Nội 🍜", category: "Food", lat: 10.7768, lon: 106.6929 },
    { id: "BTH002", name: "Gian Hàng Trà Sữa Đài Loan 🧋", category: "Drink", lat: 10.7762, lon: 106.6921 },
    { id: "BTH003", name: "Khu Trải Nghiệm Đồ Nướng 🍖", category: "Food", lat: 10.7780, lon: 106.6950 }
  ];

  const [filter, setFilter] = useState("All");

  // Tính khoảng cách Haversine và sắp xếp từ gần đến xa
  const processedBooths = initialBooths
    .map(b => ({
      ...b,
      distance: Math.round(getHaversineDistance(userLoc.lat, userLoc.lon, b.lat, b.lon))
    }))
    .filter(b => filter === "All" || b.category === filter)
    .sort((a, b) => a.distance - b.distance);

  return (
    <div style={{ fontFamily: "sans-serif", padding: 15, maxWidth: 500, margin: "0 auto" }}>
      <h3>🗺️ Bản Đồ Sự Kiện (Google Maps Mô Phỏng)</h3>
      
      {/* Giả lập khung hình Bản đồ */}
      <div style={styles.mapMock}>
        <div style={styles.userMarker}>🔵 Bạn đang ở đây</div>
        {processedBooths.map(b => (
          <div key={b.id} style={styles.boothMarker}>📍 {b.name} ({b.distance}m)</div>
        ))}
      </div>

      {/* Bộ lọc danh mục */}
      <div style={{ display: "flex", gap: 10, margin: "15px 0" }}>
        <button onClick={() => setFilter("All")} style={{...styles.filterBtn, backgroundColor: filter === "All" ? "#007bff" : "#ddd"}}>Tất cả</button>
        <button onClick={() => setFilter("Food")} style={{...styles.filterBtn, backgroundColor: filter === "Food" ? "#007bff" : "#ddd"}}>Đồ ăn 🍜</button>
        <button onClick={() => setFilter("Drink")} style={{...styles.filterBtn, backgroundColor: filter === "Drink" ? "#007bff" : "#ddd"}}>Thức uống 🧋</button>
      </div>

      {/* Danh sách Booth hiển thị bên dưới xếp theo khoảng cách gần nhất */}
      <h4>Danh sách gian hàng gần bạn:</h4>
      {processedBooths.map(b => (
        <div key={b.id} onClick={() => navigate(`/booth/${b.id}?lang=${lang}&event=${eventId}`)} style={styles.boothCard}>
          <div>
            <strong>{b.name}</strong>
            <div style={{ fontSize: 12, color: "#666" }}>Khoảng cách: {b.distance} mét</div>
          </div>
          <span style={{ color: "#007bff" }}>Xem ➡️</span>
        </div>
      ))}
    </div>
  );
}

const styles = {
  mapMock: { width: "100%", height: 180, backgroundColor: "#e5e3df", borderRadius: 12, position: "relative", padding: 15, boxSizing: "border-box" },
  userMarker: { fontSize: 13, fontWeight: "bold", color: "blue", marginBottom: 10 },
  boothMarker: { fontSize: 12, color: "#333" },
  filterBtn: { padding: "6px 12px", border: "none", borderRadius: 15, color: "#fff", fontWeight: "bold", cursor: "pointer" },
  boothCard: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12, border: "1px solid #eee", borderRadius: 8, marginBottom: 8, cursor: "pointer", backgroundColor: "#fff" }
};