using Domain.DTOs.Musics;
using Domain.DTOs.Playlists;

namespace Domain.Aggregates;

public record Track(CoreMusic Music, CorePlaylist Playlist);