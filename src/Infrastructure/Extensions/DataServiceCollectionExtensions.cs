using Domain.Interfaces.MusicPlaylists;
using Domain.Interfaces.Musics;
using Domain.Interfaces.Playlists;
using Domain.Interfaces.Users;
using Infrastructure.Repositories.MusicPlaylists;
using Infrastructure.Repositories.Musics;
using Infrastructure.Repositories.Playlists;
using Infrastructure.Repositories.Users;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Extensions;

public static class DataServiceCollectionExtensions
{
    public static IServiceCollection AddDataServices(
        this IServiceCollection services)
    {
        services.AddScoped<IUsersRepository, UsersRepository>();
        services.AddScoped<IMusicsRepository, MusicsRepository>();
        services.AddScoped<IPlaylistsRepository, PlaylistsRepository>();
        services.AddScoped<IMusicPlaylistsRepository, MusicPlaylistsRepository>();
        return services;
    }
}