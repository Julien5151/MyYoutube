using System.ComponentModel.DataAnnotations;

namespace Application.Controllers.Tracks;

public record CreateTrack([Required] [Url] string Url);

public record DeleteTrack(int NumberOfTracksDeleted);

public record TrackCreationFailed(string Reason)
{
    public int StatusCode { get; init; } = StatusCodes.Status400BadRequest;
}