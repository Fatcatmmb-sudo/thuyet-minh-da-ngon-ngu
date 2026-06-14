using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Repositories;

public class VisitLogRepository
{
    private readonly AppDbContext _db;
    public VisitLogRepository(AppDbContext db) { _db = db; }

    public async Task<VisitLog> CreateAsync(VisitLog log)
    {
        _db.VisitLogs.Add(log);
        await _db.SaveChangesAsync();
        return log;
    }

    public async Task<List<VisitLog>> GetByBoothIdAsync(int boothId, DateTime? from = null)
    {
        var query = _db.VisitLogs.Where(v => v.BoothId == boothId);
        if (from.HasValue) query = query.Where(v => v.VisitedAt >= from);
        return await query.OrderByDescending(v => v.VisitedAt).ToListAsync();
    }

    public async Task<int> CountTodayByBoothAsync(int boothId)
    {
        var today = DateTime.UtcNow.Date;
        return await _db.VisitLogs.CountAsync(v => v.BoothId == boothId && v.VisitedAt.Date == today);
    }
}