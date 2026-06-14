using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Repositories;

public class BoothRepository
{
    private readonly AppDbContext _db;
    public BoothRepository(AppDbContext db) { _db = db; }

    public async Task<(List<Booth> Data, int Total, int Active)> GetAllAsync(
        int page, int pageSize, int? eventId, int? categoryId, string? search)
    {
        var query = _db.Booths
            .Include(b => b.Event)
            .Include(b => b.Vendor)
            .Include(b => b.Category)
            .AsQueryable();

        if (eventId.HasValue)    query = query.Where(b => b.EventId == eventId);
        if (categoryId.HasValue) query = query.Where(b => b.CategoryId == categoryId);
        if (!string.IsNullOrEmpty(search))
            query = query.Where(b => b.Name.Contains(search) || (b.Description != null && b.Description.Contains(search)));

        var total  = await query.CountAsync();
        var active = await query.CountAsync(b => b.IsActive);
        var data   = await query
            .OrderByDescending(b => b.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (data, total, active);
    }

    public async Task<Booth?> GetByIdAsync(int id)
        => await _db.Booths
            .Include(b => b.Event)
            .Include(b => b.Vendor)
            .Include(b => b.Category)
            .Include(b => b.Narration)
            .Include(b => b.Images)
            .Include(b => b.Videos)
            .FirstOrDefaultAsync(b => b.Id == id);

    public async Task<Booth> CreateAsync(Booth booth)
    {
        _db.Booths.Add(booth);
        await _db.SaveChangesAsync();
        return booth;
    }

    public async Task UpdateAsync(Booth booth)
    {
        _db.Booths.Update(booth);
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Booth booth)
    {
        _db.Booths.Remove(booth);
        await _db.SaveChangesAsync();
    }

    public async Task<List<Booth>> GetByEventAsync(int eventId)
        => await _db.Booths
            .Where(b => b.EventId == eventId && b.IsActive)
            .ToListAsync();
}