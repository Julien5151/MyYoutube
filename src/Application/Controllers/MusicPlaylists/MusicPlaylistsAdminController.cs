using Application.Controllers.Musics;
using Application.Controllers.Playlists;
using Domain.DTOs.MusicPlaylists;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces.MusicPlaylists;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Application.Controllers.MusicPlaylists;

[Route("api/admin/[controller]")]
[ApiController]
[Authorize(Roles = Role.Admin)]
public class MusicPlaylistsAdminController : ControllerBase
{
    private readonly IMusicPlaylistsService _musicPlaylistsService;

    public MusicPlaylistsAdminController(IMusicPlaylistsService musicPlaylistsService)
    {
        _musicPlaylistsService = musicPlaylistsService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CoreMusicPlaylist>>> GetMusicPlaylists()
    {
        return await _musicPlaylistsService.GetAllMusicPlaylistsAsync();
    }

    [HttpGet("music/{musicId:guid}/playlist/{playlistId:guid}")]
    [ProducesResponseType<CoreMusicPlaylist>(StatusCodes.Status200OK)]
    [ProducesResponseType<MusicPlaylistNotFound>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CoreMusicPlaylist>> GetUser(Guid musicId, Guid playlistId)
    {
        var musicPlaylist = await _musicPlaylistsService.GetMusicPlaylistAsync(musicId, playlistId);
        return musicPlaylist is not null ? musicPlaylist : NotFound(new MusicPlaylistNotFound(musicId, playlistId));
    }

    [HttpPost]
    [ProducesResponseType<CoreMusicPlaylist>(StatusCodes.Status200OK)]
    [ProducesResponseType<MusicNotFound>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<PlaylistNotFound>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<CreateMusicPlaylistConflict>(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<CoreMusicPlaylist>> CreateMusicPlaylist(CreateMusicPlaylist createMusicPlaylist)
    {
        try
        {
            return await _musicPlaylistsService.CreateMusicPlaylistAsync(createMusicPlaylist.MusicId,
                createMusicPlaylist.PlaylistId);
        }
        catch (MusicNotFoundException)
        {
            return NotFound(new MusicNotFound(createMusicPlaylist.MusicId));
        }
    }

    [HttpDelete("music/{musicId:guid}/playlist/{playlistId:guid}")]
    public async Task<ActionResult<DeleteMusicPlaylist>> DeleteMusicPlaylist(Guid musicId, Guid playlistId)
    {
        var numberOfMusicPlaylistsDeleted = await _musicPlaylistsService.DeleteMusicPlaylistAsync(musicId, playlistId);
        return new DeleteMusicPlaylist(numberOfMusicPlaylistsDeleted);
    }
}