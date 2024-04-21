using Domain.DTOs.Musics;

namespace Domain.Interfaces.Musics;

public interface IMusicsService
{
    public Task<List<CoreMusic>> GetAllMusicsAsync();
    public Task<List<CoreMusic>> GetAllMusicsOfUserAsync(Guid userId);
    public Task<CoreMusic?> GetMusicAsync(Guid id);
    public Task<CoreMusic> CreateMusicAsync(string url, Guid ownerId);
    public Task<int> DeleteMusicAsync(Guid id);
    public Task<(byte[], string)> GetMusicFileAsync(uint oid);
    public Task<(byte[], string)> GetMusicFileOfUserAsync(uint oid, Guid userId);
}