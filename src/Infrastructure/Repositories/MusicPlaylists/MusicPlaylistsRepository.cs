using Domain.Entities;
using Domain.Interfaces.MusicPlaylists;
using Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories.MusicPlaylists;

public class MusicPlaylistsRepository : IMusicPlaylistsRepository
{
    private readonly MyYoutubeContext _dbContext;

    public MusicPlaylistsRepository(MyYoutubeContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<int> DeleteMusicPlaylistAsync(Guid musicId, Guid playlistId)
    {
        var musicPlaylist = await _dbContext.MusicPlaylists
            .Where(mp => mp.MusicId == musicId && mp.PlaylistId == playlistId).FirstOrDefaultAsync();
        if (musicPlaylist is null) return 0;
        _dbContext.Remove(musicPlaylist);
        await _dbContext.SaveChangesAsync();
        return 1;
    }

    public async Task<List<MusicPlaylist>> GetAllMusicPlaylistsAsync()
    {
        return await _dbContext.MusicPlaylists.Take(100).ToListAsync();
    }

    public async Task<List<MusicPlaylist>> GetAllMusicPlaylistsOfUserAsync(Guid userId)
    {
        return await (from musicPlaylist in _dbContext.MusicPlaylists
            join music in _dbContext.Musics on musicPlaylist.MusicId equals music.Id
            where music.OwnerId == userId
            select musicPlaylist).ToListAsync();
    }

    public async Task<MusicPlaylist?> GetMusicPlaylistAsync(Guid musicId, Guid playlistId)
    {
        return await _dbContext.MusicPlaylists.Where(mp => mp.MusicId == musicId && mp.PlaylistId == playlistId)
            .FirstOrDefaultAsync();
    }

    public async Task<MusicPlaylist> CreateMusicPlaylistAsync(Music music, Playlist playlist)
    {
        MusicPlaylist musicPlaylist = new() { MusicId = music.Id, PlaylistId = playlist.Id };
        _dbContext.MusicPlaylists.Add(musicPlaylist);
        await _dbContext.SaveChangesAsync();
        return musicPlaylist;
    }

    public async Task<List<MusicPlaylist>> GetAllMusicPlaylistAsync()
    {
        return await _dbContext.MusicPlaylists.ToListAsync();
    }
}