namespace backend.Services;

public class SpeechService
{
    // TODO: Tích hợp Azure Cognitive Speech
    private static readonly Dictionary<string, string> VoiceMap = new()
    {
        { "vi", "vi-VN-HoaiMyNeural"    },
        { "en", "en-US-JennyNeural"     },
        { "ja", "ja-JP-NanamiNeural"    },
        { "ko", "ko-KR-SunHiNeural"     },
        { "zh", "zh-CN-XiaoxiaoNeural"  },
    };

    public Task<object> GenerateAudioAsync(string text, string languageCode)
    {
        // Mock: trả về URL giả — thay bằng Azure SDK thật
        var voice    = VoiceMap.GetValueOrDefault(languageCode, "vi-VN-HoaiMyNeural");
        var audioUrl = $"/audio/{languageCode}/{Guid.NewGuid()}.mp3";

        return Task.FromResult<object>(new { audioUrl, voice, languageCode });
    }
}

public class SpeechRequest
{
    public string Text         { get; set; } = string.Empty;
    public string LanguageCode { get; set; } = "vi";
}