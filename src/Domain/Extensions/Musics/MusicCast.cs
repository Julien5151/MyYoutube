using Domain.DTOs.Musics;
using Domain.Entities;

namespace Domain.Extensions.Musics;

public static class MusicEntityCastExtensions
{
    public static CoreMusic ToCoreMusic(this Music music)
    {
        return new CoreMusic(music.Id, music.Oid, music.Title, music.OwnerId);
    }
}