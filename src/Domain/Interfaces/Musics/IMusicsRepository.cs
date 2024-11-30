using Domain.Entities;

namespace Domain.Interfaces.Musics;

public interface IMusicsRepository
{
    public Task<List<Music>> GetAllMusicsAsync();
    public Task<List<Music>> GetAllMusicsOfUserAsync(Guid userId);
    public Task<uint> CreateMusicFileAsync(byte[] fileBinary);
    public Music CreateMusic(string title, uint fileOid, Guid ownerId);
    public Task<int> DeleteMusicFileAsync(uint oid);
    public Task<int> DeleteMusicAsync(Guid id);
    public Task<byte[]> GetMusicFileAsync(uint oid);
    public Task<Music?> GetMusicAsync(Guid id);
    public Task<Music?> GetMusicOfUserAsync(Guid musicId, Guid ownerId);
    public Task<Music?> GetMusicOfUserByOidAsync(uint oid, Guid ownerId);
    public Task<Music?> GetMusicFromFileOidAsync(uint oid);
}