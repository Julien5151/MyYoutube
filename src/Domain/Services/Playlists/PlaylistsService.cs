using Domain.Aggregates;
using Domain.DTOs.Playlists;
using Domain.Exceptions;
using Domain.Extensions.MusicPlaylists;
using Domain.Extensions.Musics;
using Domain.Extensions.Playlists;
using Domain.Interfaces.MusicPlaylists;
using Domain.Interfaces.Musics;
using Domain.Interfaces.Playlists;
using Domain.Interfaces.Users;

namespace Domain.Services.Playlists;

public class PlaylistsService : IPlaylistsService
{
    private readonly IMusicPlaylistsRepository _musicPlaylistsRepository;
    private readonly IMusicsRepository _musicsRepository;
    private readonly IPlaylistsRepository _playlistsRepository;
    private readonly IUsersRepository _usersRepository;

    public PlaylistsService(
        IPlaylistsRepository playlistsRepository,
        IUsersRepository usersRepository,
        IMusicsRepository musicsRepository,
        IMusicPlaylistsRepository musicPlaylistsRepository)
    {
        _playlistsRepository = playlistsRepository;
        _usersRepository = usersRepository;
        _musicsRepository = musicsRepository;
        _musicPlaylistsRepository = musicPlaylistsRepository;
    }

    public async Task<List<CorePlaylist>> GetAllPlaylistsAsync()
    {
        return (await _playlistsRepository.GetAllPlaylistsAsync())
            .Select(playlist => playlist.ToCorePlaylist())
            .ToList();
    }

    public async Task<List<CorePlaylist>> GetAllPlaylistsOfUserAsync(Guid userId)
    {
        return (await _playlistsRepository.GetAllPlaylistsOfUserAsync(userId))
            .Select(playList => playList.ToCorePlaylist()).ToList();
    }

    public async Task<List<PlaylistWithMusics>> GetAllPlaylistsWithMusicsOfUserAsync(Guid userId)
    {
        var musics = (await _musicsRepository.GetAllMusicsOfUserAsync(userId))
            .Select(music => music.ToCoreMusic());
        var playlists = (await _playlistsRepository.GetAllPlaylistsOfUserAsync(userId))
            .Select(playList => playList.ToCorePlaylist());
        var musicPlaylists = (await _musicPlaylistsRepository.GetAllMusicPlaylistsOfUserAsync(userId))
            .Select(musicPlaylist => musicPlaylist.ToCoreMusicPlaylist());
        return playlists.Select(playList =>
            new PlaylistWithMusics(playList.Id, playList.UserId, playList.Title, musics.Where(music =>
                musicPlaylists.Any(musicPlaylist =>
                    musicPlaylist.MusicId == music.Id && musicPlaylist.PlaylistId == playList.Id)).ToList())
        ).ToList();
    }

    public async Task<CorePlaylist?> GetPlaylistAsync(Guid id)
    {
        return (await _playlistsRepository.GetPlaylistAsync(id))?.ToCorePlaylist();
    }

    public async Task<CorePlaylist> CreatePlaylistAsync(Guid userId, string title)
    {
        var user = await _usersRepository.GetUserAsync(userId);
        if (user is null) throw new UserNotFoundException();
        return (await _playlistsRepository.CreatePlaylistAsync(userId, title)).ToCorePlaylist();
    }

    public async Task<CorePlaylist> UpdatePlaylistAsync(CorePlaylist playlist)
    {
        return (await _playlistsRepository.UpdatePlaylistAsync(playlist)).ToCorePlaylist();
    }

    public async Task<int> DeletePlaylistAsync(Guid id)
    {
        return await _playlistsRepository.DeletePlaylistAsync(id);
    }
}