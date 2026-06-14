using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Repositories;

public class VideoRepository
{
    private readonly AppDbContext _db;
    public VideoRepository(AppDbContext db) { _db = db; }

    public async Task<List<Video>> GetByBoothIdAsync(int boothId)
        => await _db.Videos.Where(v => v.BoothId == boothId).OrderBy(v => v.CreatedAt).ToListAsync();

    public async Task<Video?> GetByIdAsync(int id)
        => await _db.Videos.FindAsync(id);

    public async Task<Video> CreateAsync(Video video)
    {
        _db.Videos.Add(video);
        await _db.SaveChangesAsync();
        return video;
    }

    public async Task DeleteAsync(Video video)
    {
        _db.Videos.Remove(video);
        await _db.SaveChangesAsync();
    }
}