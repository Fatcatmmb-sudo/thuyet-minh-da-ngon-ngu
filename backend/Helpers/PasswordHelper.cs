namespace backend.Helpers;

public static class PasswordHelper
{
    /// <summary>Hash mật khẩu dùng BCrypt.</summary>
    public static string Hash(string password)
        => BCrypt.Net.BCrypt.HashPassword(password);

    /// <summary>So sánh mật khẩu nhập vào với hash đã lưu.</summary>
    public static bool Verify(string password, string hash)
        => BCrypt.Net.BCrypt.Verify(password, hash);
}