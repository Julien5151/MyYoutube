using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces.Playlists;
using Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories.Playlists;

public class PlaylistsRepository : IPlaylistsRepository
{
    private readonly MyYoutubeContext _dbContext;

    public PlaylistsRepository(MyYoutubeContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<Playlist>> GetAllPlaylistsAsync()
    {
        return await _dbContext.Playlists.OrderBy(playlist => playlist.Id).Take(100).ToListAsync();
    }

    public async Task<List<Playlist>> GetAllPlaylistsOfUserAsync(Guid userId)
    {
        return await _dbContext.Playlists.Where(playlist => playlist.UserId == userId).ToListAsync();
    }

    public async Task<Playlist?> GetPlaylistOfUserByTitleAsync(Guid userId, string title)
    {
        return await _dbContext.Playlists
            .Where(playlist => playlist.UserId == userId && playlist.Title == title)
            .FirstOrDefaultAsync();
    }

    public async Task<Playlist?> GetPlaylistAsync(Guid id)
    {
        return await _dbContext.Playlists.FindAsync(id);
    }

    public async Task<Playlist> CreatePlaylistAsync(Guid userId, string title)
    {
        Playlist playlist = new() { Id = new Guid(), UserId = userId, Title = title };
        await _dbContext.Playlists.AddAsync(playlist);
        await _dbContext.SaveChangesAsync();
        return playlist;
    }

    public async Task<Playlist> UpdatePlaylistAsync(Playlist playlist)
    {
        var playlistToUpdate = await _dbContext.Playlists.FindAsync(playlist.Id);
        if (playlistToUpdate is null) throw new PlaylistNotFoundException();
        playlistToUpdate.Title = playlist.Title;
        await _dbContext.SaveChangesAsync();
        return playlistToUpdate;
    }

    public async Task<int> DeletePlaylistAsync(Guid id)
    {
        var playlist = await _dbContext.Playlists.FindAsync(id);
        if (playlist is null) return 0;
        _dbContext.Playlists.Remove(playlist);
        await _dbContext.SaveChangesAsync();
        return 1;
    }
}