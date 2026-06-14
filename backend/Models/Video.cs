namespace backend.Models;

public class Video
{
    public int Id { get; set; }
    public int BoothId { get; set; }

    /// <summary>URL YouTube hoặc Vimeo do Vendor nhập.</summary>
    public string VideoUrl { get; set; } = string.Empty;

    public string? Title { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // ── Navigation ────────────────────────────────────────────
    public Booth Booth { get; set; } = null!;
}