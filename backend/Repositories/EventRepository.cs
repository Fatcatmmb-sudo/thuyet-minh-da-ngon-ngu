using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Repositories;

public class EventRepository
{
    private readonly AppDbContext _db;
    public EventRepository(AppDbContext db) { _db = db; }

    public async Task<(List<Event> Data, int Total)> GetAllAsync(
        int page, int pageSize, string? search, string? status)
    {
        var query = _db.Events.Include(e => e.Booths).AsQueryable();

        if (!string.IsNullOrEmpty(search))
            query = query.Where(e => e.Name.Contains(search) || (e.Description != null && e.Description.Contains(search)));
        if (!string.IsNullOrEmpty(status))
            query = query.Where(e => e.Status == status);

        var total = await query.CountAsync();
        var data  = await query
            .OrderByDescending(e => e.StartDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (data, total);
    }

    public async Task<Event?> GetByIdAsync(int id)
        => await _db.Events.Include(e => e.Booths).FirstOrDefaultAsync(e => e.Id == id);

    public async Task<Event> CreateAsync(Event ev)
    {
        _db.Events.Add(ev);
        await _db.SaveChangesAsync();
        return ev;
    }

    public async Task UpdateAsync(Event ev)
    {
        _db.Events.Update(ev);
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Event ev)
    {
        _db.Events.Remove(ev);
        await _db.SaveChangesAsync();
    }
}