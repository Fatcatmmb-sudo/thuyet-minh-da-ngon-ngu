using backend.Models;
using backend.Repositories;

namespace backend.Services;

public class BoothService
{
    private readonly BoothRepository _repo;
    public BoothService(BoothRepository repo) { _repo = repo; }

    public async Task<object> GetAllAsync(int page, int pageSize, int? eventId, int? categoryId, string? search)
    {
        var (data, total, active) = await _repo.GetAllAsync(page, pageSize, eventId, categoryId, search);
        return new
        {
            items = data.Select(MapToResponse),
            total,
            active,
            page,
            totalPages = (int)Math.Ceiling(total / (double)pageSize),
        };
    }

    public async Task<object> GetByIdAsync(int id)
    {
        var booth = await _repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Không tìm thấy gian hàng ID = {id}.");
        return MapToResponse(booth);
    }

    public async Task<object> CreateAsync(BoothRequest request)
    {
        var booth = new Booth
        {
            EventId     = request.EventId,
            VendorId    = request.VendorId,
            CategoryId  = request.CategoryId,
            Name        = request.Name,
            Description = request.Description,
            Latitude    = request.Latitude,
            Longitude   = request.Longitude,
            Radius      = request.Radius ?? 15,
            IsActive    = true,
            CreatedAt   = DateTime.UtcNow,
        };
        var created = await _repo.CreateAsync(booth);
        return MapToResponse(created);
    }

    public async Task<object> UpdateAsync(int id, BoothRequest request)
    {
        var booth = await _repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Không tìm thấy gian hàng ID = {id}.");

        booth.Name        = request.Name;
        booth.Description = request.Description;
        booth.Latitude    = request.Latitude;
        booth.Longitude   = request.Longitude;
        booth.Radius      = request.Radius ?? booth.Radius;
        booth.CategoryId  = request.CategoryId;

        await _repo.UpdateAsync(booth);
        return MapToResponse(booth);
    }

    public async Task DeleteAsync(int id)
    {
        var booth = await _repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Không tìm thấy gian hàng ID = {id}.");
        await _repo.DeleteAsync(booth);
    }

    public async Task<List<Booth>> GetByEventAsync(int eventId)
        => await _repo.GetByEventAsync(eventId);

    private static object MapToResponse(Booth b) => new
    {
        b.Id, b.Name, b.Description,
        b.Latitude, b.Longitude, b.Radius,
        b.IsActive, b.CreatedAt,
        b.EventId, b.VendorId, b.CategoryId,
        eventName    = b.Event?.Name,
        vendorName   = b.Vendor?.CompanyName,
        categoryName = b.Category?.Name,
    };
}

public class BoothRequest
{
    public int      EventId     { get; set; }
    public int      VendorId    { get; set; }
    public int?     CategoryId  { get; set; }
    public string   Name        { get; set; } = string.Empty;
    public string?  Description { get; set; }
    public decimal  Latitude    { get; set; }
    public decimal  Longitude   { get; set; }
    public decimal? Radius      { get; set; }
}