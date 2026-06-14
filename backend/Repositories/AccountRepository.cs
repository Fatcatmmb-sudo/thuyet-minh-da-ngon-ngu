using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Repositories;

public class AccountRepository
{
    private readonly AppDbContext _db;

    public AccountRepository(AppDbContext db)
    {
        _db = db;
    }

    // ── Queries ───────────────────────────────────────────────

    public async Task<(List<Account> Data, int Total)> GetAllAsync(
        int page, int pageSize, string? role, string? search)
    {
        var query = _db.Accounts
            .Include(a => a.Vendor)
            .AsQueryable();

        if (!string.IsNullOrEmpty(role))
            query = query.Where(a => a.Role == role);

        if (!string.IsNullOrEmpty(search))
            query = query.Where(a =>
                a.Username.Contains(search) ||
                a.Email.Contains(search) ||
                (a.Vendor != null && a.Vendor.CompanyName.Contains(search)));

        var total = await query.CountAsync();
        var data  = await query
            .OrderByDescending(a => a.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (data, total);
    }

    public async Task<Account?> GetByIdAsync(int id)
        => await _db.Accounts
            .Include(a => a.Vendor)
            .FirstOrDefaultAsync(a => a.Id == id);

    public async Task<bool> ExistsUsernameAsync(string username)
        => await _db.Accounts.AnyAsync(a => a.Username == username);

    public async Task<bool> ExistsEmailAsync(string email)
        => await _db.Accounts.AnyAsync(a => a.Email == email);

    // ── Commands ──────────────────────────────────────────────

    public async Task<Account> CreateAsync(Account account, Vendor? vendor = null)
    {
        _db.Accounts.Add(account);
        await _db.SaveChangesAsync();

        if (vendor != null)
        {
            vendor.AccountId = account.Id;
            _db.Vendors.Add(vendor);
            await _db.SaveChangesAsync();
        }

        return account;
    }

    public async Task UpdateAsync(Account account)
    {
        _db.Accounts.Update(account);
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Account account)
    {
        _db.Accounts.Remove(account);
        await _db.SaveChangesAsync();
    }
}