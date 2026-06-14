namespace backend.Models;

public class Image
{
    public int Id { get; set; }
    public int BoothId { get; set; }
    public string FilePath { get; set; } = string.Empty;
    public string? Caption { get; set; }

    /// <summary>Thứ tự hiển thị trong carousel. Nhỏ hơn = hiển thị trước.</summary>
    public int SortOrder { get; set; } = 0;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // ── Navigation ────────────────────────────────────────────
    public Booth Booth { get; set; } = null!;
}