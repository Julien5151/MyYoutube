using Domain.Entities;

namespace Domain.Interfaces.Playlists;

public interface IPlaylistsRepository
{
    public Task<List<Playlist>> GetAllPlaylistsAsync();
    public Task<List<Playlist>> GetAllPlaylistsOfUserAsync(Guid userId);
    public Task<Playlist?> GetPlaylistOfUserByTitleAsync(Guid userId, string title);
    public Task<Playlist?> GetPlaylistAsync(Guid id);
    public Task<Playlist> CreatePlaylistAsync(Guid userId, string title);
    public Task<Playlist> UpdatePlaylistAsync(Playlist playlist);
    public Task<int> DeletePlaylistAsync(Guid id);
}