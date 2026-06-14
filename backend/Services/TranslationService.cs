using backend.Models;
using backend.Repositories;

namespace backend.Services;

public class TranslationService
{
    private readonly TranslationRepository _repo;
    private readonly NarrationRepository   _narrationRepo;

    public TranslationService(TranslationRepository repo, NarrationRepository narrationRepo)
    {
        _repo          = repo;
        _narrationRepo = narrationRepo;
    }

    public async Task<object> GetOneAsync(int narrationId, string lang)
    {
        var t = await _repo.GetByNarrationAndLangAsync(narrationId, lang)
            ?? throw new KeyNotFoundException($"Không tìm thấy bản dịch ngôn ngữ '{lang}'.");
        return MapToResponse(t);
    }

    public async Task<object> UpdateManualAsync(int translationId, TranslationUpdateRequest request)
    {
        var t = await _repo.GetByIdAsync(translationId)
            ?? throw new KeyNotFoundException($"Không tìm thấy bản dịch ID = {translationId}.");

        t.TranslatedContent = request.TranslatedContent;
        t.IsAutoTranslated  = false;
        await _repo.UpdateAsync(t);
        return MapToResponse(t);
    }

    /// <summary>
    /// Tạo bản dịch (hiện tại mock — tích hợp Azure OpenAI sau)
    /// </summary>
    public async Task<object> GenerateOneAsync(int narrationId, string languageCode)
    {
        var narration = await _narrationRepo.GetByIdAsync(narrationId)
            ?? throw new KeyNotFoundException($"Không tìm thấy narration ID = {narrationId}.");

        var existing = await _repo.GetByNarrationAndLangAsync(narrationId, languageCode);
        if (existing != null) return MapToResponse(existing);

        // TODO: Gọi Azure OpenAI để dịch thật
        var translation = new Translation
        {
            NarrationId       = narrationId,
            LanguageCode      = languageCode,
            TranslatedContent = $"[{languageCode.ToUpper()}] {narration.Content}",
            IsAutoTranslated  = true,
            CreatedAt         = DateTime.UtcNow,
        };
        var created = await _repo.CreateAsync(translation);
        return MapToResponse(created);
    }

    public async Task<List<object>> GenerateAllAsync(int narrationId, List<string> languages)
    {
        var results = new List<object>();
        foreach (var lang in languages)
            results.Add(await GenerateOneAsync(narrationId, lang));
        return results;
    }

    private static object MapToResponse(Translation t) => new
    {
        t.Id, t.NarrationId, t.LanguageCode,
        t.TranslatedContent, t.AudioUrl,
        t.IsAutoTranslated, t.CreatedAt,
    };
}

public class TranslationUpdateRequest
{
    public string TranslatedContent { get; set; } = string.Empty;
}