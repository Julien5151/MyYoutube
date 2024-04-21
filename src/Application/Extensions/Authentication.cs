using System.Text;
using Domain.Options;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace Application.Extensions;

public static class AuthenticationExtensions
{
    public const string JwtCookieName = "auth-jwt";

    public static CookieOptions CookiePolicyOptions =>
        new()
        {
            SameSite = SameSiteMode.Strict,
            HttpOnly = true,
            MaxAge = TimeSpan.FromDays(2)
        };

    public static IServiceCollection AddJwtAuthentication(
        this IServiceCollection services, ConfigurationManager configurationManager)
    {
        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme,
                options =>
                {
                    var jwtSettingsOptions = configurationManager.GetSection(JwtSettingsOptions.JwtSettings)
                        .Get<JwtSettingsOptions>();
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = jwtSettingsOptions!.Issuer,
                        ValidateAudience = true,
                        ValidAudience = jwtSettingsOptions!.Audience,
                        ValidateIssuerSigningKey = true,
                        ValidateLifetime = true,
                        IssuerSigningKey =
                            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettingsOptions!.SecretKey))
                    };
                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            context.Token = context.Request.Cookies[$"{JwtCookieName}"];
                            return Task.CompletedTask;
                        }
                    };
                });
        return services;
    }
}