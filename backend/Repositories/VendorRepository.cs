using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Repositories;

public class VendorRepository
{
    private readonly AppDbContext _db;
    public VendorRepository(AppDbContext db) { _db = db; }

    public async Task<Vendor?> GetByAccountIdAsync(int accountId)
        => await _db.Vendors
            .Include(v => v.Booths).ThenInclude(b => b.Event)
            .FirstOrDefaultAsync(v => v.AccountId == accountId);

    public async Task<Vendor?> GetByIdAsync(int id)
        => await _db.Vendors.Include(v => v.Account).FirstOrDefaultAsync(v => v.Id == id);

    public async Task UpdateAsync(Vendor vendor)
    {
        _db.Vendors.Update(vendor);
        await _db.SaveChangesAsync();
    }
}