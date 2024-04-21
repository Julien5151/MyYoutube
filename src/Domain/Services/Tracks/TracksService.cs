using Domain.Aggregates;
using Domain.Exceptions;
using Domain.Extensions.Playlists;
using Domain.Interfaces.MusicPlaylists;
using Domain.Interfaces.Musics;
using Domain.Interfaces.Playlists;
using Domain.Interfaces.Tracks;
using Domain.Services.Users;

namespace Domain.Services.Tracks;

public class TracksService : ITracksService
{
    private readonly IMusicPlaylistsRepository _musicPlaylistsRepository;
    private readonly IMusicsRepository _musicsRepository;
    private readonly IMusicsService _musicsService;
    private readonly IPlaylistsRepository _playlistsRepository;

    public TracksService(
        IMusicsService musicsService,
        IMusicPlaylistsRepository musicPlaylistsRepository,
        IPlaylistsRepository playlistsRepository,
        IMusicsRepository musicsRepository
    )
    {
        _musicsService = musicsService;
        _musicPlaylistsRepository = musicPlaylistsRepository;
        _playlistsRepository = playlistsRepository;
        _musicsRepository = musicsRepository;
    }

    public async Task<Track> CreateTrackAsync(string url, Guid userId)
    {
        try
        {
            var playlist =
                await _playlistsRepository.GetPlaylistOfUserByTitleAsync(userId, UsersService.DefaultPlaylistName);
            if (playlist is null) throw new PlaylistNotFoundException();
            var music = await _musicsService.CreateMusicAsync(url, userId);
            await _musicPlaylistsRepository.CreateMusicPlaylistAsync(music, playlist);
            return new Track(music, playlist.ToCorePlaylist());
        }
        catch (PlaylistNotFoundException)
        {
            throw new TrackCreationFailedException("Playlist not found");
        }
        catch (MusicCreationFailedException)
        {
            throw new TrackCreationFailedException("Could not download or create the music");
        }
        catch (Exception)
        {
            throw new TrackCreationFailedException("Something went wrong while creating the track");
        }
    }

    public async Task<int> DeleteTrackAsync(Guid musicId, Guid userId)
    {
        var musicToDelete = await _musicsRepository.GetMusicOfUserAsync(musicId, userId);
        if (musicToDelete is null) return 0;
        var nbDeletedMusic = await _musicsRepository.DeleteMusicAsync(musicId);
        if (nbDeletedMusic is 0) return 0;
        return await _musicsRepository.DeleteMusicFileAsync(musicToDelete.Oid);
    }
}