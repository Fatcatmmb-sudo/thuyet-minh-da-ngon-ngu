using backend.Models;
using backend.Repositories;

namespace backend.Services;

public class NarrationService
{
    private readonly NarrationRepository _repo;
    public NarrationService(NarrationRepository repo) { _repo = repo; }

    public async Task<object> GetByBoothIdAsync(int boothId)
    {
        var narration = await _repo.GetByBoothIdAsync(boothId);
        if (narration == null)
            return new { id = 0, boothId, title = "", content = "", updatedAt = DateTime.UtcNow };
        return MapToResponse(narration);
    }

    public async Task<object> UpsertAsync(int boothId, NarrationRequest request)
    {
        var existing = await _repo.GetByBoothIdAsync(boothId);
        if (existing == null)
        {
            var narration = new Narration
            {
                BoothId   = boothId,
                Title     = request.Title,
                Content   = request.Content,
                UpdatedAt = DateTime.UtcNow,
            };
            var created = await _repo.CreateAsync(narration);
            return MapToResponse(created);
        }

        existing.Title     = request.Title;
        existing.Content   = request.Content;
        existing.UpdatedAt = DateTime.UtcNow;
        await _repo.UpdateAsync(existing);
        return MapToResponse(existing);
    }

    public async Task<object> UpdateAsync(int narrationId, NarrationRequest request)
    {
        var narration = await _repo.GetByIdAsync(narrationId)
            ?? throw new KeyNotFoundException($"Không tìm thấy narration ID = {narrationId}.");

        narration.Title     = request.Title;
        narration.Content   = request.Content;
        narration.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateAsync(narration);
        return MapToResponse(narration);
    }

    private static object MapToResponse(Narration n) => new
    {
        n.Id, n.BoothId, n.Title, n.Content, n.UpdatedAt,
        translations = n.Translations?.Select(t => new {
            t.Id, t.LanguageCode, t.TranslatedContent, t.AudioUrl, t.IsAutoTranslated
        }),
    };
}

public class NarrationRequest
{
    public string?  Title   { get; set; }
    public string   Content { get; set; } = string.Empty;
}