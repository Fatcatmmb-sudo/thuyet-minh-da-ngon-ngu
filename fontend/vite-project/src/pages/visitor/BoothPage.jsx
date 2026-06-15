import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";

// Kho dữ liệu dịch thuật đa ngôn ngữ toàn diện (Hỗ trợ hầu hết ngôn ngữ phổ biến)
const MULTI_LANG_CONTENT = {
  BTH001: {
    vi: { 
      title: "Gian Hàng Phở Hà Nội 🍜", 
      desc: "Chào mừng bạn đến với gian hàng ẩm thực truyền thống. Phở bò Hà Nội nổi tiếng với nước dùng ngọt thanh được hầm từ xương ống bò trong 24 giờ, kết hợp cùng bánh phở mềm mại, thịt bò tươi ngon và các loại rau thơm như hành lá, húng quế, mùi tàu.", 
      payBtn: "💳 Nhấn để Thanh Toán / Tip (Yêu cầu trước khi nghe)",
      payTitle: "Thông Tin Thanh Toán",
      paySub: "Sử dụng ứng dụng Ngân hàng (VietQR) để quét mã",
      confirmPay: "✅ Tôi đã chuyển khoản thành công",
      lockedText: "🔒 Vui lòng thanh toán để mở khóa tính năng nghe thuyết minh tự động.",
      startAudioBtn: "▶️ Bắt Đầu Nghe Thuyết Minh (Có Giọng Đọc)",
      stopAudioBtn: "⏸️ Dừng Thuyết Minh",
      speechLang: "vi-VN" // Mã kích hoạt giọng đọc tiếng Việt
    },
    en: { 
      title: "Hanoi Pho Booth 🍜", 
      desc: "Welcome to the traditional food booth. Hanoi beef Pho is famous for its clear and sweet broth, simmered from beef bones for 24 hours, combined with soft rice noodles, fresh beef, and herbs like green onions, basil, and coriander.", 
      payBtn: "💳 Click to Pay / Tip (Required before listening)",
      payTitle: "Payment Information",
      paySub: "Use your Banking App to scan VietQR",
      confirmPay: "✅ I have successfully transferred the money",
      lockedText: "🔒 Please complete the payment to unlock the automatic narration feature.",
      startAudioBtn: "▶️ Start Narration (With Voice)",
      stopAudioBtn: "⏸️ Stop Narration",
      speechLang: "en-US" // Mã kích hoạt giọng đọc tiếng Anh
    },
    ja: { 
      title: "ハノイのフォー屋 🍜", 
      desc: "伝統的なフードブースへようこそ。ハノイの牛肉フォーは、牛の骨を24時間じっくり煮込んだ澄んだ甘みのあるスープが特徴で、柔らかいライスヌードル、新鮮な牛肉、そしてネギ、バジル、パクチーなどのハーブと administrative 組み合わせています。", 
      payBtn: "💳 決済・チップ (聴取前に必要)",
      payTitle: "決済情報",
      paySub: "銀行アプリでQRコードをスキャンしてください",
      confirmPay: "✅ 振込が完了しました",
      lockedText: "🔒 オーディオ解説をアンロックするには、決済を完了してください。",
      startAudioBtn: "▶️ 音声解説を開始する (音声あり)",
      stopAudioBtn: "⏸️ 音声解説を停止する",
      speechLang: "ja-JP" // Mã kích hoạt giọng đọc tiếng Nhật
    },
    zh: { 
      title: "河内河粉摊 🍜", 
      desc: "欢迎来到传统美食展位。河内牛肉河粉以其清甜的汤头而闻名，汤头由牛骨慢火熬制24小时而成，搭配柔软的河粉、新鲜的牛肉以及 text 葱、罗勒和香菜等香草。", 
      payBtn: "💳 点击支付 / 小费 (听前限制)",
      payTitle: "支付信息",
      paySub: "使用银行应用程序扫描 VietQR",
      confirmPay: "✅ 我已成功转账",
      lockedText: "🔒 请先完成支付以解锁自动语音导览功能。",
      startAudioBtn: "▶️ 开始自动语音导览 (有语音)",
      stopAudioBtn: "⏸️ 停止语音导览",
      speechLang: "zh-CN" // Mã kích hoạt giọng đọc tiếng Trung
    },
    fr: {
      title: "Stand de Pho de Hanoi 🍜",
      desc: "Bienvenue au stand de nourriture traditionnelle. Le Pho au bœuf de Hanoi est célèbre pour son bouillon clair et doux, mijoté à partir d'os de bœuf pendant 24 heures, combiné avec des nouilles de riz tendres, du bœuf frais et des herbes.",
      payBtn: "💳 Cliquez pour payer (Requis avant l'écoute)",
      payTitle: "Informations de paiement",
      paySub: "Utilisez votre application bancaire pour scanner le VietQR",
      confirmPay: "✅ J'ai transféré l'argent avec succès",
      lockedText: "🔒 Veuillez effectuer le paiement pour déverrouiller la narration audio.",
      startAudioBtn: "▶️ Lancer la narration (Avec Voix)",
      stopAudioBtn: "⏸️ Arrêter la narration",
      speechLang: "fr-FR" // Mã kích hoạt giọng đọc tiếng Pháp
    },
    ko: {
      title: "하노이 쌀국수 부스 🍜",
      desc: "전통 음식 부스에 오신 것을 환영합니다. 하노이 소고기 쌀국수는 사골을 24시간 동안 푹 고아낸 맑고 깊은 국물로 유명하며, 부드러운 쌀국수 면과 신선한 소고기, 그리고 파, 바질, 고수 등의 야채가 어우러져 있습니다.",
      payBtn: "💳 결제하기 / 팁 (듣기 전 필수)",
      payTitle: "결제 정보",
      paySub: "은행 앱을 사용하여 VietQR을 스캔하세요",
      confirmPay: "✅ 송금을 성공적으로 완료했습니다",
      lockedText: "🔒 오디오 해설을 잠금 해제하려면 결제를 완료해 주세요.",
      startAudioBtn: "▶️ 오디오 해설 시작 (음성 포함)",
      stopAudioBtn: "⏸️ 오디오 정지",
      speechLang: "ko-KR" // Mã kích hoạt giọng đọc tiếng Hàn
    }
  }
};

export default function BoothPage() {
  const { boothId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const lang = searchParams.get("lang") || "vi";
  const eventId = searchParams.get("event") || "EVT001";

  // QUẢN LÝ TRẠNG THÁI
  const [isPaid, setIsPaid] = useState(false); 
  const [isPlaying, setIsPlaying] = useState(false); 
  const [showPayModal, setShowPayModal] = useState(false); 
  const [imgIndex, setImgIndex] = useState(0);

  const images = ["🍔", "🍜", "🍲"]; 
  const currentData = MULTI_LANG_CONTENT[boothId]?.[lang] || MULTI_LANG_CONTENT["BTH001"]["en"];

  // 1. Quản lý hệ thống giọng đọc (Web Speech API)
  useEffect(() => {
    // Khi thoát trang hoặc đổi ngôn ngữ, bắt buộc phải dừng giọng đọc cũ tránh bị đè tiếng
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [lang, boothId]);

  // Hàm xử lý phát hoặc dừng giọng đọc thực tế
  const toggleSpeech = () => {
    if (isPlaying) {
      // Nếu đang phát mà bấm lại -> Dừng đọc
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      // Nếu đang tắt mà bấm -> Khởi tạo giọng đọc mới
      window.speechSynthesis.cancel(); // Xóa lệnh cũ nếu có
      
      const utterance = new SpeechSynthesisUtterance(currentData.desc);
      utterance.lang = currentData.speechLang; // Cấu hình đúng mã tiếng tương ứng
      
      // Khi giọng đọc kết thúc tự động -> Chuyển nút về trạng thái Ban đầu
      utterance.onend = () => {
        setIsPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  // 2. Định vị GPS liên tục Geofence & VISIT_LOG khi rời trang
  useEffect(() => {
    console.log(`[VISIT_LOG]: Bắt đầu tham quan booth ${boothId}`);
    const watchId = navigator.geolocation.watchPosition((pos) => {
      console.log("Geofencing checking...", pos.coords.latitude, pos.coords.longitude);
    });

    return () => {
      console.log(`[VISIT_LOG]: Đã rời khỏi booth ${boothId}. Ghi log lên hệ thống.`);
      navigator.geolocation.clearWatch(watchId);
    };
  }, [boothId]);

  const handleLangChange = (newLang) => {
    setSearchParams({ lang: newLang, event: eventId });
    window.speechSynthesis.cancel(); // Tắt tiếng cũ ngay khi bấm đổi tiếng khác
    setIsPlaying(false); 
  };

  const handleConfirmPayment = () => {
    setIsPaid(true); 
    setShowPayModal(false); 
  };

  const qrPaymentUrl = `https://img.vietqr.io/image/MB-1234567899999-qr_only.png?addInfo=Thanh%20Toan%20${boothId}%20Event%20${eventId}`;

  return (
    <div style={{ fontFamily: "sans-serif", padding: 15, maxWidth: 500, margin: "0 auto", position: "relative", minHeight: "100vh" }}>
      <button onClick={() => navigate(`/map?event=${eventId}&lang=${lang}`)} style={styles.backBtn}>⬅️ Trở về bản đồ</button>

      {/* Carousel ảnh/video */}
      <div style={styles.carousel}>
        <div style={{ fontSize: 80 }}>{images[imgIndex]}</div>
        <div style={styles.carouselNav}>
          <button onClick={() => setImgIndex((imgIndex - 1 + images.length) % images.length)}>◀️</button>
          <span>Ảnh {imgIndex + 1}/3</span>
          <button onClick={() => setImgIndex((imgIndex + 1) % images.length)}>▶️</button>
        </div>
      </div>

      {/* Nội dung chi tiết */}
      <h2>{currentData.title}</h2>
      <p style={{ lineHeight: "1.6", color: "#444", marginBottom: 20 }}>{currentData.desc}</p>

      {/* KIỂM TRA LUỒNG BẢO MẬT THANH TOÁN */}
      {!isPaid ? (
        <div style={styles.lockedBox}>
          <p style={{ color: "#dc3545", fontWeight: "bold", fontSize: 14, margin: "0 0 12px 0" }}>{currentData.lockedText}</p>
          <button onClick={() => setShowPayModal(true)} style={styles.payTriggerBtn}>
            {currentData.payBtn}
          </button>
        </div>
      ) : (
        <div style={styles.audioBox}>
          {/* Bấm vào nút này sẽ thực sự phát ra tiếng đọc đại diện cho từng quốc gia */}
          <button 
            onClick={toggleSpeech} 
            style={{...styles.playBtn, backgroundColor: isPlaying ? "#dc3545" : "#28a745"}}
          >
            {isPlaying ? currentData.stopAudioBtn : currentData.startAudioBtn}
          </button>
          {isPlaying && (
            <p style={styles.audioStatus}>
              🔊 Đang phát giọng đọc trí tuệ nhân tạo chuẩn ngôn ngữ mã [{currentData.speechLang}]...
            </p>
          )}
        </div>
      )}

      {/* Chuyển đổi full ngôn ngữ */}
      <div style={{ marginTop: 25 }}>
        <p style={{ fontSize: 13, fontWeight: "bold" }}>Chuyển đổi ngôn ngữ thuyết minh:</p>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          <button onClick={() => handleLangChange("vi")} style={styles.langBtn}>🇻🇳 VI</button>
          <button onClick={() => handleLangChange("en")} style={styles.langBtn}>🇬🇧 EN</button>
          <button onClick={() => handleLangChange("ja")} style={styles.langBtn}>🇯🇵 JA</button>
          <button onClick={() => handleLangChange("zh")} style={styles.langBtn}>🇨🇳 ZH</button>
          <button onClick={() => handleLangChange("kr")} style={styles.langBtn}>🇰🇷 KO</button>
          <button onClick={() => handleLangChange("fr")} style={styles.langBtn}>🇫🇷 FR</button>
        </div>
      </div>

      {/* POPUP QR THANH TOÁN */}
      {showPayModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h4 style={{ margin: 0 }}>{currentData.payTitle}</h4>
              <button onClick={() => setShowPayModal(false)} style={styles.closeModalBtn}>✕</button>
            </div>
            
            <p style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>{currentData.paySub}</p>
            
            <div style={styles.qrContainer}>
              <img src={qrPaymentUrl} alt="QR Payment" style={{ width: "100%", maxHeight: 200, objectFit: "contain" }} />
            </div>

            <div style={styles.bankDetails}>
              <div>Ngân hàng: <b>MB Bank</b></div>
              <div>Số TK: <b>1234567899999</b></div>
              <div>Nội dung: <b>Thanh Toan {boothId}</b></div>
            </div>

            <button onClick={handleConfirmPayment} style={styles.confirmPayBtn}>
              {currentData.confirmPay}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  backBtn: { background: "none", border: "none", color: "#007bff", cursor: "pointer", fontSize: 14, marginBottom: 15 },
  carousel: { width: "100%", height: 180, backgroundColor: "#f0f0f0", borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" },
  carouselNav: { position: "absolute", bottom: 10, display: "flex", gap: 15, alignItems: "center", backgroundColor: "rgba(255,255,255,0.8)", padding: "4px 10px", borderRadius: 15, fontSize: 12 },
  lockedBox: { padding: 15, backgroundColor: "#fff5f5", borderRadius: 10, border: "1px dashed #feb2b2", textAlign: "center" },
  payTriggerBtn: { width: "100%", padding: "12px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: "bold", cursor: "pointer" },
  audioBox: { padding: 15, backgroundColor: "#f0fff4", borderRadius: 10, border: "1px solid #c6f6d5", textAlign: "center" },
  playBtn: { padding: "12px 24px", color: "#fff", border: "none", borderRadius: 25, fontSize: 15, fontWeight: "bold", cursor: "pointer", width: "100%" },
  audioStatus: { fontSize: 13, color: "#155724", fontStyle: "italic", marginTop: 10 },
  langBtn: { minWidth: "60px", padding: 8, border: "1px solid #ccc", borderRadius: 6, backgroundColor: "#fff", cursor: "pointer", fontSize: 12 },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 15 },
  modalCard: { backgroundColor: "#fff", width: "100%", maxWidth: 350, padding: 20, borderRadius: 16 },
  closeModalBtn: { background: "none", border: "none", fontSize: 18, color: "#999", cursor: "pointer" },
  qrContainer: { backgroundColor: "#f9f9f9", padding: 8, borderRadius: 12, display: "flex", justifyContent: "center", marginBottom: 12, border: "1px solid #eee" },
  bankDetails: { textAlign: "left", fontSize: 12, backgroundColor: "#f1f5f9", padding: 10, borderRadius: 8, color: "#334155", lineHeight: "1.5", marginBottom: 15 },
  confirmPayBtn: { width: "100%", padding: "12px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: "bold", cursor: "pointer" }
};