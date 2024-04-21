using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

public static class Role
{
    public const string Client = "Client";
    public const string Admin = "Admin";
}

public class User
{
    public required Guid Id { get; set; }
    [MaxLength(255)] public string Name { get; set; } = string.Empty;
    [MaxLength(255)] [EmailAddress] public required string Email { get; set; }
    [MaxLength(255)] public required string Password { get; set; } = string.Empty;

    [MaxLength(255)]
    [AllowedValues([Entities.Role.Client, Entities.Role.Admin])]
    public required string Role { get; set; } = Entities.Role.Client;
}