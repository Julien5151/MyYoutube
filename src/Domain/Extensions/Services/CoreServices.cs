using Domain.Interfaces.MusicPlaylists;
using Domain.Interfaces.Musics;
using Domain.Interfaces.Playlists;
using Domain.Interfaces.Tracks;
using Domain.Interfaces.Users;
using Domain.Services.MusicPlaylists;
using Domain.Services.Musics;
using Domain.Services.Playlists;
using Domain.Services.Tracks;
using Domain.Services.Users;
using Microsoft.Extensions.DependencyInjection;

namespace Domain.Extensions.Services;

public static class CoreServicesCollectionExtensions
{
    public static IServiceCollection AddCoreServices(
        this IServiceCollection services)
    {
        services.AddScoped<IUsersService, UsersService>();
        services.AddScoped<IMusicsService, MusicsService>();
        services.AddScoped<IPlaylistsService, PlaylistsService>();
        services.AddScoped<IMusicPlaylistsService, MusicPlaylistsService>();
        services.AddScoped<ITracksService, TracksService>();
        return services;
    }
}