using Domain.Entities;

namespace Domain.Interfaces.MusicPlaylists;

public interface IMusicPlaylistsRepository
{
    public Task<List<MusicPlaylist>> GetAllMusicPlaylistsAsync();
    public Task<List<MusicPlaylist>> GetAllMusicPlaylistsOfUserAsync(Guid userId);
    public Task<MusicPlaylist?> GetMusicPlaylistAsync(Guid musicId, Guid playlistId);
    public Task<MusicPlaylist> CreateMusicPlaylistAsync(Music music, Playlist playlist);
    public Task<int> DeleteMusicPlaylistAsync(Guid musicId, Guid playlistId);
}