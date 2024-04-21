using Domain.DTOs.MusicPlaylists;
using Domain.Entities;

namespace Domain.Extensions.MusicPlaylists;

public static class MusicPlaylistCastExtensions
{
    public static CoreMusicPlaylist ToCoreMusicPlaylist(this MusicPlaylist musicPlaylist)
    {
        return new CoreMusicPlaylist(musicPlaylist.PlaylistId, musicPlaylist.MusicId);
    }
}