using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Repositories;

public class TranslationRepository
{
    private readonly AppDbContext _db;
    public TranslationRepository(AppDbContext db) { _db = db; }

    public async Task<Translation?> GetByNarrationAndLangAsync(int narrationId, string lang)
        => await _db.Translations
            .FirstOrDefaultAsync(t => t.NarrationId == narrationId && t.LanguageCode == lang);

    public async Task<Translation?> GetByIdAsync(int id)
        => await _db.Translations.FindAsync(id);

    public async Task<List<Translation>> GetByNarrationIdAsync(int narrationId)
        => await _db.Translations.Where(t => t.NarrationId == narrationId).ToListAsync();

    public async Task<Translation> CreateAsync(Translation translation)
    {
        _db.Translations.Add(translation);
        await _db.SaveChangesAsync();
        return translation;
    }

    public async Task UpdateAsync(Translation translation)
    {
        _db.Translations.Update(translation);
        await _db.SaveChangesAsync();
    }
}