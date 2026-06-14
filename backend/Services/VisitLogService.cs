using backend.Models;
using backend.Repositories;

namespace backend.Services;

public class VisitLogService
{
    private readonly VisitLogRepository _repo;
    public VisitLogService(VisitLogRepository repo) { _repo = repo; }

    public async Task<object> LogVisitAsync(VisitLogRequest request)
    {
        var log = new VisitLog
        {
            BoothId      = request.BoothId,
            LanguageCode = request.LanguageCode,
            DeviceType   = request.DeviceType,
            Duration     = request.DurationSec,
            VisitedAt    = DateTime.UtcNow,
        };
        var created = await _repo.CreateAsync(log);
        return new { created.Id, created.BoothId, created.VisitedAt };
    }

    public async Task<object> GetByBoothAsync(int boothId, DateTime? from)
    {
        var logs = await _repo.GetByBoothIdAsync(boothId, from);
        return logs.Select(v => new
        {
            v.Id, v.BoothId, v.LanguageCode,
            v.DeviceType, v.Duration, v.VisitedAt,
        });
    }
}

public class VisitLogRequest
{
    public int    BoothId      { get; set; }
    public string LanguageCode { get; set; } = "vi";
    public string DeviceType   { get; set; } = "Mobile";
    public int    DurationSec  { get; set; } = 0;
}