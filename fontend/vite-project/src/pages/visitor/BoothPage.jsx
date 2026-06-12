import { useState } from "react";

export default function BoothPage() {
  const [text, setText] = useState("");
  const [lang, setLang] = useState("vi");
  const [booth, setBooth] = useState("VinAI");

  const handleTranslate = () => {
    let content = booth === "VinAI"
      ? "VinAI là công ty AI hàng đầu Việt Nam."
      : "FPT Software là công ty công nghệ hàng đầu.";

    setText(`[${lang}] ${content}`);
  };

  const handleSpeak = () => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = lang === "en" ? "en-US" : "vi-VN";
    speechSynthesis.speak(speech);
  };

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh", padding: 40 }}>
      <div style={{
        maxWidth: 600,
        margin: "auto",
        padding: 30,
        background: "#fff",
        borderRadius: 10,
        boxShadow: "0 0 10px rgba(0,0,0,0.1)"
      }}>
        <h2>🎤 Thuyết minh gian hàng</h2>

        <p>Gian hàng:</p>
        <select onChange={(e) => setBooth(e.target.value)}>
          <option>VinAI</option>
          <option>FPT Software</option>
        </select>

        <p>Ngôn ngữ:</p>
        <select onChange={(e) => setLang(e.target.value)}>
          <option value="vi">Tiếng Việt</option>
          <option value="en">English</option>
        </select>

        <br /><br />

        <button onClick={handleTranslate}>📄 Dịch</button>
        <button onClick={handleSpeak} style={{ marginLeft: 10 }}>
          🔊 Phát
        </button>

        <div style={{ marginTop: 20, padding: 10, border: "1px solid #ccc" }}>
          {text || "Nội dung sẽ hiển thị tại đây..."}
        </div>
      </div>
    </div>
  );
}
