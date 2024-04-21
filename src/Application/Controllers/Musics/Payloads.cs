using System.ComponentModel.DataAnnotations;

namespace Application.Controllers.Musics;

public record CreateMusic([Required] [Url] string Url, [Required] Guid userId);

public record MusicNotFound(Guid Guid)
{
    public int StatusCode { get; init; } = StatusCodes.Status404NotFound;
}

public record MusicFileNotFound(uint Oid)
{
    public int StatusCode { get; init; } = StatusCodes.Status404NotFound;
}

public record MusicCreationFailed
{
    public int StatusCode { get; init; } = StatusCodes.Status400BadRequest;
}

public record DeleteMusic(int NumberOfMusicsDeleted);