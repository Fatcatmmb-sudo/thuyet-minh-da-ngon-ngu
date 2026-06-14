using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // ── DbSets ────────────────────────────────────────────────
    public DbSet<Account>     Accounts     { get; set; }
    public DbSet<Vendor>      Vendors      { get; set; }
    public DbSet<Event>       Events       { get; set; }
    public DbSet<Category>    Categories   { get; set; }
    public DbSet<Booth>       Booths       { get; set; }
    public DbSet<Narration>   Narrations   { get; set; }
    public DbSet<Translation> Translations { get; set; }
    public DbSet<Image>       Images       { get; set; }
    public DbSet<Video>       Videos       { get; set; }
    public DbSet<VisitLog>    VisitLogs    { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ── ACCOUNT ───────────────────────────────────────────
        modelBuilder.Entity<Account>(e =>
        {
            e.ToTable("ACCOUNT");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("AccountID");
            e.Property(x => x.Status).HasMaxLength(20);
            e.Ignore(x => x.IsActive);
            e.Property(x => x.Username).IsRequired().HasMaxLength(100);
            e.Property(x => x.PasswordHash).IsRequired();
            e.Property(x => x.Email).IsRequired().HasMaxLength(200);
            e.Property(x => x.Role).IsRequired().HasMaxLength(20);
            e.HasIndex(x => x.Username).IsUnique();
            e.HasIndex(x => x.Email).IsUnique();
        });

        // ── VENDOR ────────────────────────────────────────────
        modelBuilder.Entity<Vendor>(e =>
        {
            e.ToTable("VENDOR");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("VendorID");
            e.Property(x => x.AccountId).HasColumnName("AccountID");
            e.Property(x => x.CompanyName).IsRequired().HasMaxLength(200);
            e.Property(x => x.RepresentativeName).HasMaxLength(200);
            e.Property(x => x.PhoneNumber).HasMaxLength(20);

            e.HasOne(x => x.Account)
             .WithOne(x => x.Vendor)
             .HasForeignKey<Vendor>(x => x.AccountId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // ── EVENT ─────────────────────────────────────────────
        modelBuilder.Entity<Event>(e =>
        {
            e.ToTable("EVENT");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("EventID");
            e.Property(x => x.Name).HasColumnName("EventName").IsRequired().HasMaxLength(200);
            e.Property(x => x.Description).HasMaxLength(1000);
            e.Property(x => x.Location).HasMaxLength(500);
            e.Property(x => x.Status).IsRequired().HasMaxLength(50);
        });

        // ── CATEGORY ──────────────────────────────────────────
        modelBuilder.Entity<Category>(e =>
        {
            e.ToTable("CATEGORY");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("CategoryID");
            e.Property(x => x.Name).HasColumnName("CategoryName").IsRequired().HasMaxLength(100);
            e.Property(x => x.Description).HasMaxLength(500);
        });

        // ── BOOTH ─────────────────────────────────────────────
        modelBuilder.Entity<Booth>(e =>
        {
            e.ToTable("BOOTH");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("BoothID");
            e.Property(x => x.EventId).HasColumnName("EventID");
            e.Property(x => x.VendorId).HasColumnName("VendorID");
            e.Property(x => x.CategoryId).HasColumnName("CategoryID");
            e.Property(x => x.Name).HasColumnName("BoothName").IsRequired().HasMaxLength(200);
            e.Property(x => x.Description).HasMaxLength(1000);
            e.Property(x => x.Latitude).HasColumnType("decimal(10,7)");
            e.Property(x => x.Longitude).HasColumnType("decimal(10,7)");
            e.Property(x => x.Radius).HasColumnType("decimal(10,2)");

            e.HasOne(x => x.Event)
             .WithMany(x => x.Booths)
             .HasForeignKey(x => x.EventId)
             .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(x => x.Vendor)
             .WithMany(x => x.Booths)
             .HasForeignKey(x => x.VendorId)
             .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(x => x.Category)
             .WithMany(x => x.Booths)
             .HasForeignKey(x => x.CategoryId)
             .OnDelete(DeleteBehavior.Restrict);

            e.HasIndex(x => x.EventId);
            e.HasIndex(x => x.VendorId);
        });

        // ── NARRATION ─────────────────────────────────────────
        modelBuilder.Entity<Narration>(e =>
        {
            e.ToTable("NARRATION");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("NarrationID");
            e.Property(x => x.BoothId).HasColumnName("BoothID");
            e.Property(x => x.Content).HasColumnName("OriginalContent").IsRequired();
            e.Property(x => x.Title).HasMaxLength(300);

            e.HasOne(x => x.Booth)
             .WithOne(x => x.Narration)
             .HasForeignKey<Narration>(x => x.BoothId)
             .OnDelete(DeleteBehavior.Cascade);

            e.HasIndex(x => x.BoothId).IsUnique();
        });

        // ── TRANSLATION ───────────────────────────────────────
        modelBuilder.Entity<Translation>(e =>
        {
            e.ToTable("TRANSLATION");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("TranslationID");
            e.Property(x => x.NarrationId).HasColumnName("NarrationID");
            e.Property(x => x.LanguageCode).IsRequired().HasMaxLength(5);
            e.Property(x => x.TranslatedContent).IsRequired();
            e.Property(x => x.AudioUrl).HasMaxLength(500);

            e.HasOne(x => x.Narration)
             .WithMany(x => x.Translations)
             .HasForeignKey(x => x.NarrationId)
             .OnDelete(DeleteBehavior.Cascade);

            e.HasIndex(x => new { x.NarrationId, x.LanguageCode }).IsUnique();
        });

        // ── IMAGE ─────────────────────────────────────────────
        modelBuilder.Entity<Image>(e =>
        {
            e.ToTable("IMAGE");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("ImageID");
            e.Property(x => x.BoothId).HasColumnName("BoothID");
            e.Property(x => x.FilePath).HasColumnName("ImageUrl").IsRequired().HasMaxLength(500);
            e.Property(x => x.SortOrder).HasColumnName("OrderIndex");
            e.Property(x => x.Caption).HasMaxLength(300);

            e.HasOne(x => x.Booth)
             .WithMany(x => x.Images)
             .HasForeignKey(x => x.BoothId)
             .OnDelete(DeleteBehavior.Cascade);

            e.HasIndex(x => x.BoothId);
        });

        // ── VIDEO ─────────────────────────────────────────────
        modelBuilder.Entity<Video>(e =>
        {
            e.ToTable("VIDEO");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("VideoID");
            e.Property(x => x.BoothId).HasColumnName("BoothID");
            e.Property(x => x.VideoUrl).IsRequired().HasMaxLength(500);
            e.Property(x => x.Title).HasMaxLength(200);

            e.HasOne(x => x.Booth)
             .WithMany(x => x.Videos)
             .HasForeignKey(x => x.BoothId)
             .OnDelete(DeleteBehavior.Cascade);

            e.HasIndex(x => x.BoothId);
        });

        // ── VISIT_LOG ─────────────────────────────────────────
        modelBuilder.Entity<VisitLog>(e =>
        {
            e.ToTable("VISIT_LOG");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("VisitID");
            e.Property(x => x.BoothId).HasColumnName("BoothID");
            e.Property(x => x.LanguageCode).IsRequired().HasMaxLength(5);
            e.Property(x => x.DeviceType).IsRequired().HasMaxLength(20);
            e.Property(x => x.Duration).HasColumnName("DurationSec");
            e.Property(x => x.VisitedAt).HasColumnName("AccessTime");

            e.HasOne(x => x.Booth)
             .WithMany(x => x.VisitLogs)
             .HasForeignKey(x => x.BoothId)
             .OnDelete(DeleteBehavior.Cascade);

            e.HasIndex(x => x.BoothId);
            e.HasIndex(x => x.VisitedAt);
            e.HasIndex(x => new { x.BoothId, x.VisitedAt });
        });
    }
}