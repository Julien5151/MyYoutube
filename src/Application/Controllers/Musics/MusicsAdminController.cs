using Domain.DTOs.Musics;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces.Musics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Exceptions_FileNotFoundException = Domain.Exceptions.FileNotFoundException;

namespace Application.Controllers.Musics;

[Route("api/admin/[controller]")]
[ApiController]
[Authorize(Roles = Role.Admin)]
public class MusicsAdminController : ControllerBase
{
    private readonly IMusicsService _musicsService;

    public MusicsAdminController(IMusicsService musicsService)
    {
        _musicsService = musicsService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CoreMusic>>> GetMusics()
    {
        return await _musicsService.GetAllMusicsAsync();
    }

    [HttpGet("file/{oid:int}")]
    [ProducesResponseType<MusicFileNotFound>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetMusicFile(uint oid)
    {
        try
        {
            (byte[] File, string Title) result = await _musicsService.GetMusicFileAsync(oid);
            return File(result.File, "audio/mpeg3", result.Title);
        }
        catch (Exceptions_FileNotFoundException)
        {
            return NotFound(new MusicFileNotFound(oid));
        }
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType<CoreMusic>(StatusCodes.Status200OK)]
    [ProducesResponseType<MusicNotFound>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CoreMusic>> GetMusic(Guid id)
    {
        var music = await _musicsService.GetMusicAsync(id);
        return music is not null ? music : NotFound(new MusicNotFound(id));
    }

    [HttpPost]
    [ProducesResponseType<CoreMusic>(StatusCodes.Status200OK)]
    [ProducesResponseType<MusicCreationFailed>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CoreMusic>> CreateMusic(CreateMusic createMusic)
    {
        try
        {
            return await _musicsService.CreateMusicAsync(createMusic.Url, createMusic.userId);
        }
        catch (MusicCreationFailedException)
        {
            return BadRequest(new MusicCreationFailed());
        }
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<DeleteMusic>> DeleteMusic(Guid id)
    {
        var numberOfMusicsDeleted = await _musicsService.DeleteMusicAsync(id);
        return new DeleteMusic(numberOfMusicsDeleted);
    }
}