using Domain.Entities;

namespace Domain.DTOs.MusicPlaylists;

public record CoreMusicPlaylist(Guid PlaylistId, Guid MusicId)
{
    public static implicit operator MusicPlaylist(CoreMusicPlaylist coreMusicPlaylist)
    {
        return new MusicPlaylist { PlaylistId = coreMusicPlaylist.PlaylistId, MusicId = coreMusicPlaylist.MusicId };
    }
}