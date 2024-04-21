using Domain.Options;

namespace Application.Extensions;

public static class ConfigurationExtensions
{
    public static IServiceCollection AddConfigurationOptions(
        this IServiceCollection services, ConfigurationManager configurationManager)
    {
        services.Configure<JwtSettingsOptions>(
            configurationManager.GetSection(JwtSettingsOptions.JwtSettings));
        return services;
    }
}