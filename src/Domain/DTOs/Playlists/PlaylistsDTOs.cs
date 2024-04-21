using Domain.Entities;

namespace Domain.DTOs.Playlists;

public record CorePlaylist(Guid Id, Guid UserId, string Title)
{
    public static implicit operator Playlist(CorePlaylist corePlaylist)
    {
        return new Playlist { Id = corePlaylist.Id, UserId = corePlaylist.UserId, Title = corePlaylist.Title };
    }
}