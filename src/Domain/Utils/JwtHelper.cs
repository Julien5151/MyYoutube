using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Domain.Entities;
using Domain.Options;
using Microsoft.IdentityModel.Tokens;

namespace Domain.Utils;

public static class JwtHelper
{
    private const int TokenDurationInDays = 1;
    private static readonly JwtSecurityTokenHandler TokenHandler = new();

    public static string GenerateJwt(JwtSettingsOptions options, User user)
    {
        var secretKey = Encoding.UTF8.GetBytes(options.SecretKey);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new(ClaimTypes.Email, user.Email),
                new(ClaimTypes.Role, user.Role),
                new(ClaimTypes.PrimarySid, user.Id.ToString())
            }),
            Audience = options.Audience,
            Issuer = options.Issuer,
            Expires = DateTime.UtcNow.AddDays(TokenDurationInDays),
            SigningCredentials =
                new SigningCredentials(new SymmetricSecurityKey(secretKey), SecurityAlgorithms.HmacSha256Signature)
        };
        return TokenHandler.WriteToken(TokenHandler.CreateToken(tokenDescriptor));
    }
}