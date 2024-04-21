using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Database;

public class MyYoutubeContext : DbContext
{
    public MyYoutubeContext(DbContextOptions<MyYoutubeContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Playlist> Playlists { get; set; }
    public DbSet<Music> Musics { get; set; }
    public DbSet<MusicPlaylist> MusicPlaylists { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasMany<Playlist>()
            .WithOne()
            .HasForeignKey(playlist => playlist.UserId)
            .IsRequired();

        modelBuilder.Entity<User>()
            .HasMany<Music>()
            .WithOne()
            .HasForeignKey(music => music.OwnerId)
            .IsRequired();

        modelBuilder.Entity<User>()
            .HasIndex(user => user.Email);

        modelBuilder.Entity<Playlist>()
            .HasMany<MusicPlaylist>()
            .WithOne()
            .HasForeignKey(musicPlaylist => musicPlaylist.PlaylistId)
            .IsRequired();

        modelBuilder.Entity<MusicPlaylist>()
            .HasKey(musicPlaylist => new { musicPlaylist.MusicId, musicPlaylist.PlaylistId });

        modelBuilder.Entity<Music>()
            .HasMany<MusicPlaylist>()
            .WithOne()
            .HasForeignKey(musicPlaylist => musicPlaylist.MusicId)
            .IsRequired();
    }
}