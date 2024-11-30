using Domain.DTOs.Musics;
using Domain.Exceptions;
using Domain.Extensions.Musics;
using Domain.Interfaces.Musics;
using YoutubeExplode;
using YoutubeExplode.Videos.Streams;
using FileNotFoundException = Domain.Exceptions.FileNotFoundException;

namespace Domain.Services.Musics;

public class MusicsService : IMusicsService
{
    private readonly IMusicsRepository _musicsRepository;

    public MusicsService(IMusicsRepository musicsRepository)
    {
        _musicsRepository = musicsRepository;
    }

    public async Task<List<CoreMusic>> GetAllMusicsAsync()
    {
        return (await _musicsRepository.GetAllMusicsAsync())
            .Select(music => music.ToCoreMusic())
            .ToList();
    }

    public async Task<List<CoreMusic>> GetAllMusicsOfUserAsync(Guid userId)
    {
        return (await _musicsRepository.GetAllMusicsOfUserAsync(userId))
            .Select(music => music.ToCoreMusic())
            .ToList();
    }

    public async Task<CoreMusic?> GetMusicAsync(Guid id)
    {
        return (await _musicsRepository.GetMusicAsync(id))?.ToCoreMusic();
    }

    public async Task<CoreMusic> CreateMusicAsync(string url, Guid ownerId)
    {
        try
        {
            var youtube = new YoutubeClient();
            // Extract title
            var streamManifest = await youtube.Videos.Streams.GetManifestAsync(url);
            var video = await youtube.Videos.GetAsync(url);
            var title = video.Title;
            var videoTitle = title.Length >= 200 ? title[..200] : title;
            // Extract audio stream
            var streamInfo = streamManifest.GetAudioOnlyStreams().GetWithHighestBitrate();
            await using var stream = await youtube.Videos.Streams.GetAsync(streamInfo);
            var binaryMemoryStream = new MemoryStream();
            await stream.CopyToAsync(binaryMemoryStream);
            var musicFileOid = await _musicsRepository.CreateMusicFileAsync(binaryMemoryStream.ToArray());
            var musicId = _musicsRepository.CreateMusic(videoTitle, musicFileOid, ownerId);
            return musicId.ToCoreMusic();
        }
        catch (Exception)
        {
            throw new MusicCreationFailedException();
        }
    }

    public async Task<int> DeleteMusicAsync(Guid id)
    {
        return await _musicsRepository.DeleteMusicAsync(id);
    }

    public async Task<(byte[], string)> GetMusicFileAsync(uint oid)
    {
        try
        {
            var music = await _musicsRepository.GetMusicFromFileOidAsync(oid);
            if (music is null) throw new MusicNotFoundException();
            var file = await _musicsRepository.GetMusicFileAsync(oid);
            return (file, music.Title);
        }
        catch (Exception)
        {
            throw new FileNotFoundException();
        }
    }

    public async Task<(byte[], string)> GetMusicFileOfUserAsync(uint oid, Guid userId)
    {
        var music = await _musicsRepository.GetMusicOfUserByOidAsync(oid, userId);
        if (music is null) throw new FileNotFoundException();
        var file = await _musicsRepository.GetMusicFileAsync(oid);
        return (file, music.Title);
    }
}