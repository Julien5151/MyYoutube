using Domain.Entities;

namespace Domain.DTOs.Musics;

public record CoreMusic(Guid Id, uint Oid, string Title, Guid OwnerId)
{
    public static implicit operator Music(CoreMusic coreMusic)
    {
        return new Music
            { Id = coreMusic.Id, Oid = coreMusic.Oid, Title = coreMusic.Title, OwnerId = coreMusic.OwnerId };
    }
}