using Domain.DTOs.Playlists;
using Domain.Entities;

namespace Domain.Extensions.Playlists;

public static class PlaylistEntityCastExtensions
{
    public static CorePlaylist ToCorePlaylist(this Playlist playlist)
    {
        return new CorePlaylist(playlist.Id, playlist.UserId, playlist.Title);
    }
}