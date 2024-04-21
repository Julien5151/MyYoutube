using Domain.Aggregates;

namespace Domain.Interfaces.Tracks;

public interface ITracksService
{
    public Task<Track> CreateTrackAsync(string url, Guid userId);
    public Task<int> DeleteTrackAsync(Guid musicId, Guid userId);
}