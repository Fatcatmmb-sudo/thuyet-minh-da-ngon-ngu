namespace backend.Models;

public class VisitLog
{
    public int Id { get; set; }
    public int BoothId { get; set; }

    /// <summary>"vi" | "en" | "ja" | "ko" | "zh"</summary>
    public string LanguageCode { get; set; } = string.Empty;

    /// <summary>"Mobile" | "Tablet" | "Desktop"</summary>
    public string DeviceType { get; set; } = string.Empty;

    /// <summary>Thời lượng nghe thực tế tính bằng giây.</summary>
    public int Duration { get; set; } = 0;

    public DateTime VisitedAt { get; set; } = DateTime.UtcNow;

    // ── Navigation ────────────────────────────────────────────
    public Booth Booth { get; set; } = null!;
}