using Application.Controllers.Base;
using Domain.Aggregates;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces.Tracks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Application.Controllers.Tracks;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = Role.Client)]
public class TracksController : ClientControllerBase
{
    private readonly ITracksService _tracksService;

    public TracksController(ITracksService tracksService)
    {
        _tracksService = tracksService;
    }

    [HttpPost]
    [ProducesResponseType<Track>(StatusCodes.Status200OK)]
    [ProducesResponseType<TrackCreationFailed>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<Track>> CreateTrack(CreateTrack createTrack)
    {
        try
        {
            return await _tracksService.CreateTrackAsync(createTrack.Url, GetUserId());
        }
        catch (TrackCreationFailedException exception)
        {
            return BadRequest(new TrackCreationFailed(exception.Message));
        }
    }

    [HttpDelete("{musicId:guid}")]
    public async Task<ActionResult<DeleteTrack>> DeleteTrack(Guid musicId)
    {
        var numberOfTracksDeleted = await _tracksService.DeleteTrackAsync(musicId, GetUserId());
        return new DeleteTrack(numberOfTracksDeleted);
    }
}