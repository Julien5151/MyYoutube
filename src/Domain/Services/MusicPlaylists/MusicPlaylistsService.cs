using Domain.DTOs.MusicPlaylists;
using Domain.Exceptions;
using Domain.Extensions.MusicPlaylists;
using Domain.Interfaces.MusicPlaylists;
using Domain.Interfaces.Musics;
using Domain.Interfaces.Playlists;

namespace Domain.Services.MusicPlaylists;

public class MusicPlaylistsService : IMusicPlaylistsService
{
    private readonly IMusicPlaylistsRepository _musicPlaylistRepository;
    private readonly IMusicsRepository _musicsRepository;
    private readonly IPlaylistsRepository _playlistRepository;

    public MusicPlaylistsService(
        IMusicPlaylistsRepository musicPlaylistRepository,
        IMusicsRepository musicsRepository,
        IPlaylistsRepository playlistRepository)
    {
        _musicPlaylistRepository = musicPlaylistRepository;
        _musicsRepository = musicsRepository;
        _playlistRepository = playlistRepository;
    }

    public async Task<List<CoreMusicPlaylist>> GetAllMusicPlaylistsAsync()
    {
        return (await _musicPlaylistRepository.GetAllMusicPlaylistsAsync())
            .Select(musicPlaylist => musicPlaylist.ToCoreMusicPlaylist())
            .ToList();
    }

    public async Task<List<CoreMusicPlaylist>> GetAllMusicPlaylistsOfUserAsync(Guid userId)
    {
        return (await _musicPlaylistRepository.GetAllMusicPlaylistsOfUserAsync(userId))
            .Select(musicPlaylist => musicPlaylist.ToCoreMusicPlaylist())
            .ToList();
    }

    public async Task<CoreMusicPlaylist?> GetMusicPlaylistAsync(Guid musicId, Guid playlistId)
    {
        return (await _musicPlaylistRepository.GetMusicPlaylistAsync(musicId, playlistId))?.ToCoreMusicPlaylist();
    }

    public async Task<CoreMusicPlaylist> CreateMusicPlaylistAsync(Guid musicId, Guid playlistId)
    {
        var music = await _musicsRepository.GetMusicAsync(musicId);
        if (music is null) throw new MusicNotFoundException();
        var playlist = await _playlistRepository.GetPlaylistAsync(playlistId);
        if (playlist is null) throw new PlaylistNotFoundException();
        var musicPlaylistAlreadyExisting = await _musicPlaylistRepository.GetMusicPlaylistAsync(musicId, playlistId);
        if (musicPlaylistAlreadyExisting is not null) throw new MusicPlaylistConflictException();
        return _musicPlaylistRepository.CreateMusicPlaylist(music, playlist).ToCoreMusicPlaylist();
    }

    public async Task<int> DeleteMusicPlaylistAsync(Guid musicId, Guid playlistId)
    {
        return await _musicPlaylistRepository.DeleteMusicPlaylistAsync(musicId, playlistId);
    }
}