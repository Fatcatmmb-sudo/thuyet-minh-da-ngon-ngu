using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Repositories;

public class NarrationRepository
{
    private readonly AppDbContext _db;
    public NarrationRepository(AppDbContext db) { _db = db; }

    public async Task<Narration?> GetByBoothIdAsync(int boothId)
        => await _db.Narrations
            .Include(n => n.Translations)
            .FirstOrDefaultAsync(n => n.BoothId == boothId);

    public async Task<Narration?> GetByIdAsync(int id)
        => await _db.Narrations
            .Include(n => n.Translations)
            .FirstOrDefaultAsync(n => n.Id == id);

    public async Task<Narration> CreateAsync(Narration narration)
    {
        _db.Narrations.Add(narration);
        await _db.SaveChangesAsync();
        return narration;
    }

    public async Task UpdateAsync(Narration narration)
    {
        _db.Narrations.Update(narration);
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Narration narration)
    {
        _db.Narrations.Remove(narration);
        await _db.SaveChangesAsync();
    }
}