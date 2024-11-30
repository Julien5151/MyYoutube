using Application.Attributes;
using Application.Controllers.Users;
using Domain.DTOs.Playlists;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces.Playlists;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Application.Controllers.Playlists;

[Route("api/admin/[controller]")]
[ApiController]
[Authorize(Roles = Role.Admin)]
public class PlaylistsAdminController : ControllerBase
{
    private readonly IPlaylistsService _playlistsService;

    public PlaylistsAdminController(IPlaylistsService playlistsService)
    {
        _playlistsService = playlistsService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CorePlaylist>>> GetPlaylists()
    {
        return await _playlistsService.GetAllPlaylistsAsync();
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType<CorePlaylist>(StatusCodes.Status200OK)]
    [ProducesResponseType<PlaylistNotFound>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CorePlaylist>> GetPlaylist(Guid id)
    {
        var playlist = await _playlistsService.GetPlaylistAsync(id);
        return playlist is not null ? playlist : NotFound(new PlaylistNotFound(id));
    }

    [UnitOfWork]
    [HttpPost]
    [ProducesResponseType<CorePlaylist>(StatusCodes.Status200OK)]
    [ProducesResponseType<UserNotFound>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CorePlaylist>> CreatePlaylist(CreatePlaylist createPlaylist)
    {
        try
        {
            return await _playlistsService.CreatePlaylistAsync(createPlaylist.UserId, createPlaylist.Title);
        }
        catch (UserNotFoundException)
        {
            return NotFound(new UserNotFound(createPlaylist.UserId));
        }
    }

    [UnitOfWork]
    [HttpPut("{id:guid}")]
    [ProducesResponseType<CorePlaylist>(StatusCodes.Status200OK)]
    [ProducesResponseType<PlaylistNotFound>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CorePlaylist>> UpdatePlaylist(Guid id, UpdatePlaylist playlist)
    {
        if (id != playlist.Id) return BadRequest();
        try
        {
            return await _playlistsService.UpdatePlaylistAsync(playlist);
        }
        catch (PlaylistNotFoundException)
        {
            return NotFound(new PlaylistNotFound(id));
        }
    }

    [UnitOfWork]
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<DeletePlaylist>> DeletePlaylist(Guid id)
    {
        var numberOfPlaylistsDeleted = await _playlistsService.DeletePlaylistAsync(id);
        return new DeletePlaylist(numberOfPlaylistsDeleted);
    }
}