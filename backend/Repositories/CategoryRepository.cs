using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Repositories;

public class CategoryRepository
{
    private readonly AppDbContext _db;
    public CategoryRepository(AppDbContext db) { _db = db; }

    public async Task<List<Category>> GetAllAsync()
        => await _db.Categories.OrderBy(c => c.Name).ToListAsync();

    public async Task<Category?> GetByIdAsync(int id)
        => await _db.Categories.FindAsync(id);

    public async Task<Category> CreateAsync(Category category)
    {
        _db.Categories.Add(category);
        await _db.SaveChangesAsync();
        return category;
    }

    public async Task UpdateAsync(Category category)
    {
        _db.Categories.Update(category);
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Category category)
    {
        _db.Categories.Remove(category);
        await _db.SaveChangesAsync();
    }
}