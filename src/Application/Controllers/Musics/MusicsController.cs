using Application.Controllers.Base;
using Domain.Entities;
using Domain.Interfaces.Musics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Exceptions_FileNotFoundException = Domain.Exceptions.FileNotFoundException;

namespace Application.Controllers.Musics;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = Role.Client)]
public class MusicsController : ClientControllerBase
{
    private readonly IMusicsService _musicsService;

    public MusicsController(IMusicsService musicsService)
    {
        _musicsService = musicsService;
    }

    [HttpGet("file/{oid:int}")]
    [ProducesResponseType<MusicFileNotFound>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetMusicFile(uint oid)
    {
        try
        {
            (byte[] File, string Title) result = await _musicsService.GetMusicFileOfUserAsync(oid, GetUserId());
            return File(result.File, "audio/mpeg3", result.Title);
        }
        catch (Exceptions_FileNotFoundException)
        {
            return NotFound(new MusicFileNotFound(oid));
        }
    }
}