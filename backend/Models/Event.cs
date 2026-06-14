namespace backend.Models;

public class Event
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Location { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    /// <summary>"Active" | "Inactive" | "Upcoming"</summary>
    public string Status { get; set; } = "Active";

    // ── Navigation ────────────────────────────────────────────
    public ICollection<Booth> Booths { get; set; } = new List<Booth>();
}