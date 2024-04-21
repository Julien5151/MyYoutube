using Domain.Aggregates;
using Domain.DTOs.Playlists;

namespace Domain.Interfaces.Playlists;

public interface IPlaylistsService
{
    public Task<List<CorePlaylist>> GetAllPlaylistsAsync();
    public Task<List<CorePlaylist>> GetAllPlaylistsOfUserAsync(Guid userId);
    public Task<List<PlaylistWithMusics>> GetAllPlaylistsWithMusicsOfUserAsync(Guid userId);

    public Task<CorePlaylist?> GetPlaylistAsync(Guid id);
    public Task<CorePlaylist> CreatePlaylistAsync(Guid userId, string title);
    public Task<CorePlaylist> UpdatePlaylistAsync(CorePlaylist playlist);
    public Task<int> DeletePlaylistAsync(Guid id);
}