using Microsoft.EntityFrameworkCore;
using backend.Data;

namespace backend.Services;

public class ReportService
{
    private readonly AppDbContext _db;

    public ReportService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<object> GetSummaryAsync(int eventId, string range)
    {
        var from  = GetFromDate(range);
        var query = _db.VisitLogs
            .Where(v => v.Booth.EventId == eventId && v.VisitedAt >= from);

        var total     = await query.CountAsync();
        var avgSecs   = total == 0 ? 0 : await query.AverageAsync(v => (double)v.Duration);
        var languages = await query.Select(v => v.LanguageCode).Distinct().CountAsync();

        return new { total, avgDurationSec = Math.Round(avgSecs), languages };
    }

    public async Task<object> GetChartAsync(int eventId, string range)
    {
        int days = range == "month" ? 30 : 7;
        var from = DateTime.UtcNow.Date.AddDays(-days + 1);

        var logs = await _db.VisitLogs
            .Where(v => v.Booth.EventId == eventId && v.VisitedAt.Date >= from)
            .GroupBy(v => v.VisitedAt.Date)
            .Select(g => new { date = g.Key, count = g.Count() })
            .ToListAsync();

        var labels = Enumerable.Range(0, days)
            .Select(i => from.AddDays(i).ToString("dd/MM")).ToList();
        var values = Enumerable.Range(0, days)
            .Select(i => logs.FirstOrDefault(l => l.date == from.AddDays(i))?.count ?? 0)
            .ToList();

        return new { labels, values };
    }

    public async Task<object> GetByLanguageAsync(int eventId)
    {
        var total = await _db.VisitLogs.CountAsync(v => v.Booth.EventId == eventId);
        var data  = await _db.VisitLogs
            .Where(v => v.Booth.EventId == eventId)
            .GroupBy(v => v.LanguageCode)
            .Select(g => new {
                languageCode = g.Key,
                count        = g.Count(),
                pct          = total == 0 ? 0 : Math.Round(g.Count() * 100.0 / total, 1),
            })
            .OrderByDescending(x => x.count)
            .ToListAsync();

        return data;
    }

    public async Task<object> GetByDeviceAsync(int eventId)
    {
        var total = await _db.VisitLogs.CountAsync(v => v.Booth.EventId == eventId);
        var data  = await _db.VisitLogs
            .Where(v => v.Booth.EventId == eventId)
            .GroupBy(v => v.DeviceType)
            .Select(g => new {
                deviceType = g.Key,
                count      = g.Count(),
                pct        = total == 0 ? 0 : Math.Round(g.Count() * 100.0 / total, 1),
            })
            .OrderByDescending(x => x.count)
            .ToListAsync();

        return data;
    }

    public async Task<object> GetByBoothAsync(int eventId)
    {
        var data = await _db.VisitLogs
            .Where(v => v.Booth.EventId == eventId)
            .GroupBy(v => new { v.BoothId, v.Booth.Name })
            .Select(g => new {
                id     = g.Key.BoothId,
                name   = g.Key.Name,
                visits = g.Count(),
                avgDur = Math.Round(g.Average(v => (double)v.Duration), 1),
            })
            .OrderByDescending(x => x.visits)
            .ToListAsync();

        return data;
    }

    private static DateTime GetFromDate(string range) => range switch
    {
        "month" => DateTime.UtcNow.Date.AddDays(-30),
        _       => DateTime.UtcNow.Date.AddDays(-7),
    };
}