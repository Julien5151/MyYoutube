using Domain.DTOs.MusicPlaylists;

namespace Domain.Interfaces.MusicPlaylists;

public interface IMusicPlaylistsService
{
    public Task<List<CoreMusicPlaylist>> GetAllMusicPlaylistsAsync();
    public Task<List<CoreMusicPlaylist>> GetAllMusicPlaylistsOfUserAsync(Guid userId);
    public Task<CoreMusicPlaylist?> GetMusicPlaylistAsync(Guid musicId, Guid playlistId);
    public Task<CoreMusicPlaylist> CreateMusicPlaylistAsync(Guid musicId, Guid playlistId);
    public Task<int> DeleteMusicPlaylistAsync(Guid musicId, Guid playlistId);
}