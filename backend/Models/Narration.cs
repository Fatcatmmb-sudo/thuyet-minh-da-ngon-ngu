namespace backend.Models;

public class Narration
{
    public int Id { get; set; }
    public int BoothId { get; set; }
    public string? Title { get; set; }

    /// <summary>Nội dung gốc tiếng Việt do Vendor nhập.</summary>
    public string Content { get; set; } = string.Empty;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // ── Navigation ────────────────────────────────────────────
    public Booth Booth { get; set; } = null!;
    public ICollection<Translation> Translations { get; set; } = new List<Translation>();
}