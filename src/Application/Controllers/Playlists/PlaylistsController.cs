using Application.Controllers.Base;
using Domain.Aggregates;
using Domain.Entities;
using Domain.Interfaces.Playlists;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Application.Controllers.Playlists;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = Role.Client)]
public class PlaylistsController : ClientControllerBase
{
    private readonly IPlaylistsService _playlistsService;

    public PlaylistsController(IPlaylistsService playlistsService)
    {
        _playlistsService = playlistsService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PlaylistWithMusics>>> GetPlaylists()
    {
        return await _playlistsService.GetAllPlaylistsWithMusicsOfUserAsync(GetUserId());
    }
}