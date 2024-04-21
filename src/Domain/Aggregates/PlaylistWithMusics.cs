using Domain.DTOs.Musics;
using Domain.DTOs.Playlists;

namespace Domain.Aggregates;

public record PlaylistWithMusics(Guid Id, Guid UserId, string Title, List<CoreMusic> Musics)
    : CorePlaylist(Id, UserId, Title);