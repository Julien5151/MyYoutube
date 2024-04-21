using Microsoft.AspNetCore.Identity;

namespace Domain.Utils;

public static class PasswordHelper
{
    private static readonly PasswordHasher<object> PasswordHasher = new();

    public static string HashPassword(string password)
    {
        return PasswordHasher.HashPassword(null!, password);
    }

    public static PasswordVerificationResult VerifyPassword(string hashedPassword, string passwordToCheck)
    {
        return PasswordHasher.VerifyHashedPassword(null!, hashedPassword, passwordToCheck);
    }
}