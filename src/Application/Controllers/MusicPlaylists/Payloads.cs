using System.ComponentModel.DataAnnotations;

namespace Application.Controllers.MusicPlaylists;

public record CreateMusicPlaylist([Required] Guid MusicId, [Required] Guid PlaylistId);

public record CreateMusicPlaylistConflict(Guid MusicId, Guid PlaylistId);

public record DeleteMusicPlaylist(int NumberOfMusicPlaylistDeleted);

public record MusicPlaylistNotFound(Guid MusicId, Guid PlaylistId)
{
    public int StatusCode { get; init; } = StatusCodes.Status404NotFound;
}