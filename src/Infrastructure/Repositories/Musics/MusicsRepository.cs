using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces.Musics;
using Infrastructure.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Npgsql;
using FileNotFoundException = Domain.Exceptions.FileNotFoundException;
using NpgsqlLargeObjectManager = Infrastructure.Utils.NpgsqlLargeObjectManager;

namespace Infrastructure.Repositories.Musics;

public class MusicsRepository : IMusicsRepository
{
    private readonly string _connectionString;
    private readonly MyYoutubeContext _dbContext;

    public MusicsRepository(MyYoutubeContext dbContext, IConfiguration configuration)
    {
        _dbContext = dbContext;
        _connectionString = configuration.GetConnectionString("MyYoutubeApiDatabase")!;
    }

    public async Task<List<Music>> GetAllMusicsAsync()
    {
        return await _dbContext.Musics.OrderBy(music => music.Id).Take(100).ToListAsync();
    }

    public async Task<List<Music>> GetAllMusicsOfUserAsync(Guid userId)
    {
        return await _dbContext.Musics.Where(music => music.OwnerId == userId).ToListAsync();
    }

    public async Task<int> DeleteMusicFileAsync(uint oid)
    {
        await using var dataSource = NpgsqlDataSource.Create(_connectionString);
        var connection = dataSource.CreateConnection();
        if (connection is null) throw new DbConnectionException();
        await connection.OpenAsync();
        var manager = new NpgsqlLargeObjectManager(connection);
        await manager.UnlinkAsync(oid);
        await connection.CloseAsync();
        return 1;
    }

    public async Task<int> DeleteMusicAsync(Guid id)
    {
        var music = await _dbContext.Musics.FindAsync(id);
        if (music is null) return 0;
        _dbContext.Remove(music);
        return 1;
    }

    public async Task<byte[]> GetMusicFileAsync(uint oid)
    {
        await using var dataSource = NpgsqlDataSource.Create(_connectionString);
        var connection = dataSource.CreateConnection();
        if (connection is null) throw new DbConnectionException();
        await connection.OpenAsync();
        var manager = new NpgsqlLargeObjectManager(connection);
        byte[] binaryData;
        await using (var transaction = await connection.BeginTransactionAsync())
        {
            var musicFile = await manager.OpenReadAsync(oid);
            if (musicFile is null) throw new FileNotFoundException();
            binaryData = new byte[await musicFile.GetLengthAsync()];
            await musicFile.ReadExactlyAsync(binaryData);
            await transaction.CommitAsync();
        }

        await connection.CloseAsync();
        return binaryData;
    }

    public async Task<Music?> GetMusicAsync(Guid id)
    {
        return await _dbContext.Musics.FindAsync(id);
    }

    public async Task<Music?> GetMusicOfUserAsync(Guid musicId, Guid ownerId)
    {
        return await _dbContext.Musics.Where(music => music.Id == musicId && music.OwnerId == ownerId)
            .FirstOrDefaultAsync();
    }

    public async Task<Music?> GetMusicOfUserByOidAsync(uint oid, Guid ownerId)
    {
        return await _dbContext.Musics.Where(music => music.Oid == oid && music.OwnerId == ownerId)
            .FirstOrDefaultAsync();
    }

    public async Task<Music?> GetMusicFromFileOidAsync(uint oid)
    {
        return await _dbContext.Musics.Where(music => music.Oid == oid).FirstOrDefaultAsync();
    }

    public async Task<uint> CreateMusicFileAsync(byte[] fileBinary)
    {
        await using var dataSource = NpgsqlDataSource.Create(_connectionString);
        var connection = dataSource.CreateConnection();
        if (connection is null) throw new DbConnectionException();
        await connection.OpenAsync();
        var manager = new NpgsqlLargeObjectManager(connection);
        var oid = manager.Create();
        await using (var transaction = await connection.BeginTransactionAsync())
        {
            await using (var stream = await manager.OpenReadWriteAsync(oid))
            {
                stream.Write(fileBinary, 0, fileBinary.Length);
            }

            await transaction.CommitAsync();
        }

        await connection.CloseAsync();
        return oid;
    }

    public Music CreateMusic(string title, uint fileOid, Guid ownerId)
    {
        var newMusic = new Music { Id = Guid.NewGuid(), Oid = fileOid, Title = title, OwnerId = ownerId };
        _dbContext.Musics.Add(newMusic);
        return newMusic;
    }
}