using backend.DTOs;
using backend.Helpers;
using backend.Models;
using backend.Repositories;

namespace backend.Services;

public class AccountService
{
    private readonly AccountRepository _repo;

    public AccountService(AccountRepository repo)
    {
        _repo = repo;
    }

    public async Task<AccountListResponse> GetAllAsync(
        int page, int pageSize, string? role, string? search)
    {
        var (data, total) = await _repo.GetAllAsync(page, pageSize, role, search);
        return new AccountListResponse
        {
            Data       = data.Select(MapToResponse).ToList(),
            Total      = total,
            Page       = page,
            TotalPages = (int)Math.Ceiling(total / (double)pageSize),
        };
    }

    public async Task<AccountResponse> GetByIdAsync(int id)
    {
        var account = await _repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Không tìm thấy tài khoản ID = {id}.");
        return MapToResponse(account);
    }

    public async Task<AccountResponse> CreateAsync(CreateAccountRequest request)
    {
        if (await _repo.ExistsUsernameAsync(request.Username))
            throw new InvalidOperationException("Tên đăng nhập đã tồn tại.");
        if (await _repo.ExistsEmailAsync(request.Email))
            throw new InvalidOperationException("Email đã được sử dụng.");

        var account = new Account
        {
            Username     = request.Username,
            PasswordHash = PasswordHelper.Hash(request.Password),
            Email        = request.Email,
            Role         = request.Role,
            Status       = "Active",
            CreatedAt    = DateTime.UtcNow,
        };

        Vendor? vendor = null;
        if (request.Role == "Vendor")
        {
            vendor = new Vendor
            {
                CompanyName        = request.CompanyName        ?? string.Empty,
                RepresentativeName = request.RepresentativeName ?? string.Empty,
                PhoneNumber        = request.PhoneNumber        ?? string.Empty,
            };
        }

        var created = await _repo.CreateAsync(account, vendor);
        return MapToResponse(created);
    }

    public async Task<AccountResponse> UpdateAsync(int id, UpdateAccountRequest request)
    {
        var account = await _repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Không tìm thấy tài khoản ID = {id}.");

        account.Email = request.Email;
        if (account.Vendor != null)
        {
            account.Vendor.CompanyName        = request.CompanyName        ?? account.Vendor.CompanyName;
            account.Vendor.RepresentativeName = request.RepresentativeName ?? account.Vendor.RepresentativeName;
            account.Vendor.PhoneNumber        = request.PhoneNumber        ?? account.Vendor.PhoneNumber;
        }

        await _repo.UpdateAsync(account);
        return MapToResponse(account);
    }

    public async Task DeleteAsync(int id)
    {
        var account = await _repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Không tìm thấy tài khoản ID = {id}.");
        await _repo.DeleteAsync(account);
    }

    public async Task SetStatusAsync(int id, bool isActive)
    {
        var account = await _repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Không tìm thấy tài khoản ID = {id}.");
        account.Status = isActive ? "Active" : "Inactive";
        await _repo.UpdateAsync(account);
    }

    public async Task ResetPasswordAsync(int id, ResetPasswordRequest request)
    {
        var account = await _repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Không tìm thấy tài khoản ID = {id}.");
        account.PasswordHash = PasswordHelper.Hash(request.NewPassword);
        await _repo.UpdateAsync(account);
    }

    private static AccountResponse MapToResponse(Account a) => new()
    {
        Id                 = a.Id,
        Username           = a.Username,
        Email              = a.Email,
        Role               = a.Role,
        IsActive           = a.IsActive,
        CreatedAt          = a.CreatedAt,
        CompanyName        = a.Vendor?.CompanyName,
        RepresentativeName = a.Vendor?.RepresentativeName,
        PhoneNumber        = a.Vendor?.PhoneNumber,
    };
}