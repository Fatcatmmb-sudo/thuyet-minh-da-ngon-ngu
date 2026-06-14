namespace backend.Models;

public class Translation
{
    public int Id { get; set; }
    public int NarrationId { get; set; }

    /// <summary>"vi" | "en" | "ja" | "ko" | "zh"</summary>
    public string LanguageCode { get; set; } = string.Empty;

    public string TranslatedContent { get; set; } = string.Empty;
    public string? AudioUrl { get; set; }

    /// <summary>true nếu do AI dịch tự động.</summary>
    public bool IsAutoTranslated { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // ── Navigation ────────────────────────────────────────────
    public Narration Narration { get; set; } = null!;
}