using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Repositories;

public class ImageRepository
{
    private readonly AppDbContext _db;
    public ImageRepository(AppDbContext db) { _db = db; }

    public async Task<List<Image>> GetByBoothIdAsync(int boothId)
        => await _db.Images.Where(i => i.BoothId == boothId).OrderBy(i => i.SortOrder).ToListAsync();

    public async Task<Image?> GetByIdAsync(int id)
        => await _db.Images.FindAsync(id);

    public async Task<Image> CreateAsync(Image image)
    {
        _db.Images.Add(image);
        await _db.SaveChangesAsync();
        return image;
    }

    public async Task UpdateAsync(Image image)
    {
        _db.Images.Update(image);
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Image image)
    {
        _db.Images.Remove(image);
        await _db.SaveChangesAsync();
    }
}