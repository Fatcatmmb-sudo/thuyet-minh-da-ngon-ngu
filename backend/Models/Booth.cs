namespace backend.Models;

public class Booth
{
    public int Id { get; set; }
    public int EventId { get; set; }
    public int VendorId { get; set; }
    public int? CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }

    /// <summary>Bán kính geofence tính bằng mét.</summary>
    public decimal Radius { get; set; } = 15;

    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // ── Navigation ────────────────────────────────────────────
    public Event Event { get; set; } = null!;
    public Vendor Vendor { get; set; } = null!;
    public Category? Category { get; set; }
    public Narration? Narration { get; set; }
    public ICollection<Image> Images { get; set; } = new List<Image>();
    public ICollection<Video> Videos { get; set; } = new List<Video>();
    public ICollection<VisitLog> VisitLogs { get; set; } = new List<VisitLog>();
}