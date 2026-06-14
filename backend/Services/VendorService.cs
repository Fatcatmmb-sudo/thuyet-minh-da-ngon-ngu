using backend.Repositories;

namespace backend.Services;

public class VendorService
{
    private readonly VendorRepository   _vendorRepo;
    private readonly VisitLogRepository _visitLogRepo;

    public VendorService(VendorRepository vendorRepo, VisitLogRepository visitLogRepo)
    {
        _vendorRepo   = vendorRepo;
        _visitLogRepo = visitLogRepo;
    }

    public async Task<object> GetMeAsync(int accountId)
    {
        var vendor = await _vendorRepo.GetByAccountIdAsync(accountId)
            ?? throw new KeyNotFoundException("Không tìm thấy thông tin vendor.");

        return new
        {
            vendor.Id,
            vendor.AccountId,
            vendor.CompanyName,
            vendor.RepresentativeName,
            vendor.PhoneNumber,
        };
    }

    public async Task<object> GetMyBoothsAsync(int accountId)
    {
        var vendor = await _vendorRepo.GetByAccountIdAsync(accountId)
            ?? throw new KeyNotFoundException("Không tìm thấy thông tin vendor.");

        var result = new List<object>();
        foreach (var b in vendor.Booths)
        {
            var listensToday = await _visitLogRepo.CountTodayByBoothAsync(b.Id);
            result.Add(new
            {
                b.Id,
                b.Name,
                b.IsActive,
                eventName = b.Event?.Name,
                listensToday,
            });
        }

        return result;
    }

    public async Task<object> GetStatsTodayAsync(int accountId)
    {
        var vendor = await _vendorRepo.GetByAccountIdAsync(accountId)
            ?? throw new KeyNotFoundException("Không tìm thấy thông tin vendor.");

        var totalBooths  = vendor.Booths.Count;
        var listensToday = 0;

        foreach (var b in vendor.Booths)
            listensToday += await _visitLogRepo.CountTodayByBoothAsync(b.Id);

        return new { totalBooths, listensToday, totalLanguages = 5 };
    }
}