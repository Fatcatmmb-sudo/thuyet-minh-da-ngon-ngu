using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/booths")]
public class BoothController : ControllerBase
{
    private readonly BoothService _service;

    public BoothController(BoothService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int     page       = 1,
        [FromQuery] int     pageSize   = 10,
        [FromQuery] int?    eventId    = null,
        [FromQuery] int?    categoryId = null,
        [FromQuery] string? search     = null)
    {
        var result = await _service.GetAllAsync(page, pageSize, eventId, categoryId, search);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try { return Ok(await _service.GetByIdAsync(id)); }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] BoothRequest request)
    {
        try
        {
            var result = await _service.CreateAsync(request);
            return Ok(result);
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] BoothRequest request)
    {
        try { return Ok(await _service.UpdateAsync(id, request)); }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try { await _service.DeleteAsync(id); return NoContent(); }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }

    [HttpGet("{id}/qrcode")]
    public IActionResult GetQRCode(int id)
    {
        return Ok(new { qrCodeUrl = $"/qr/{id}.png" });
    }

    [HttpGet("nearest")]
    public async Task<IActionResult> FindNearest(
        [FromQuery] double lat,
        [FromQuery] double lng,
        [FromQuery] int    eventId,
        [FromQuery] double radius = 50)
    {
        var booths = await _service.GetByEventAsync(eventId);

        var nearest = booths
            .Select(b => new {
                b.Id, b.Name,
                distance = Math.Sqrt(
                    Math.Pow((double)b.Latitude - lat, 2) +
                    Math.Pow((double)b.Longitude - lng, 2)) * 111000
            })
            .Where(b => b.distance <= radius)
            .OrderBy(b => b.distance)
            .FirstOrDefault();

        if (nearest == null)
            return NotFound(new { message = "Không tìm thấy gian hàng gần đây." });

        return Ok(nearest);
    }
}