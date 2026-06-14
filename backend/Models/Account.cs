namespace backend.Models;

public class Account
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    /// <summary>"Admin" | "Vendor"</summary>
    public string Role { get; set; } = "Vendor";

    /// <summary>"Active" | "Inactive"</summary>
    public string Status { get; set; } = "Active";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Helper không map vào DB
    public bool IsActive => Status == "Active";

    // ── Navigation ────────────────────────────────────────────
    public Vendor? Vendor { get; set; }
}