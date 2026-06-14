using backend.Models;
using backend.Repositories;

namespace backend.Services;

public class EventService
{
    private readonly EventRepository _repo;
    public EventService(EventRepository repo) { _repo = repo; }

    public async Task<object> GetAllAsync(int page, int pageSize, string? search, string? status)
    {
        var (data, total) = await _repo.GetAllAsync(page, pageSize, search, status);
        return new
        {
            items = data.Select(MapToResponse),
            total,
            page,
            totalPages = (int)Math.Ceiling(total / (double)pageSize),
        };
    }

    public async Task<object> GetByIdAsync(int id)
    {
        var ev = await _repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Không tìm thấy sự kiện ID = {id}.");
        return MapToResponse(ev);
    }

    public async Task<object> CreateAsync(EventRequest request)
    {
        var ev = new Event
        {
            Name        = request.Name,
            Description = request.Description,
            Location    = request.Location,
            StartDate   = request.StartDate,
            EndDate     = request.EndDate,
            Status      = request.Status ?? "Active",
        };
        var created = await _repo.CreateAsync(ev);
        return MapToResponse(created);
    }

    public async Task<object> UpdateAsync(int id, EventRequest request)
    {
        var ev = await _repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Không tìm thấy sự kiện ID = {id}.");

        ev.Name        = request.Name;
        ev.Description = request.Description;
        ev.Location    = request.Location;
        ev.StartDate   = request.StartDate;
        ev.EndDate     = request.EndDate;
        ev.Status      = request.Status ?? ev.Status;

        await _repo.UpdateAsync(ev);
        return MapToResponse(ev);
    }

    public async Task DeleteAsync(int id)
    {
        var ev = await _repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Không tìm thấy sự kiện ID = {id}.");
        await _repo.DeleteAsync(ev);
    }

    public async Task<object> GetBoothsByEventAsync(int eventId)
    {
        var ev = await _repo.GetByIdAsync(eventId)
            ?? throw new KeyNotFoundException($"Không tìm thấy sự kiện ID = {eventId}.");

        return ev.Booths?.Select(b => new {
            b.Id, b.Name, b.Description,
            b.Latitude, b.Longitude, b.IsActive
        }) ?? Enumerable.Empty<object>();
    }

    private static object MapToResponse(Event e) => new
    {
        e.Id, e.Name, e.Description,
        e.Location, e.StartDate, e.EndDate, e.Status,
        boothCount = e.Booths?.Count ?? 0,
    };
}

public class EventRequest
{
    public string   Name        { get; set; } = string.Empty;
    public string?  Description { get; set; }
    public string?  Location    { get; set; }
    public DateTime StartDate   { get; set; }
    public DateTime EndDate     { get; set; }
    public string?  Status      { get; set; }
}