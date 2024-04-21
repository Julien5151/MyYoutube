using System.ComponentModel.DataAnnotations;
using Domain.DTOs.Playlists;

namespace Application.Controllers.Playlists;

public record CreatePlaylist([Required] Guid UserId, [Required] [MaxLength(255)] string Title);

public record PlaylistNotFound(Guid Id)
{
    public int StatusCode { get; init; } = StatusCodes.Status404NotFound;
}

public record UpdatePlaylist([Required] Guid Id, [Required] Guid UserId, [Required] [MaxLength(255)] string Title)
{
    public static implicit operator CorePlaylist(UpdatePlaylist updatePlaylist)
    {
        return new CorePlaylist(updatePlaylist.Id, updatePlaylist.UserId, updatePlaylist.Title);
    }
}

public record DeletePlaylist(int NumberOfPlaylistsDeleted);