using System.ComponentModel.DataAnnotations;
using Domain.DTOs.Users;
using Domain.Entities;

namespace Application.Controllers.Users;

public record UserNotFound(Guid Id)
{
    public int StatusCode { get; init; } = StatusCodes.Status404NotFound;
}

public record UserAlreadyExists(string Email)
{
    public int StatusCode { get; init; } = StatusCodes.Status409Conflict;
}

public record CreateUser(
    [Required] [MaxLength(255)] string Name,
    [Required]
    [MaxLength(255)]
    [EmailAddress]
    string Email,
    [Required]
    [MaxLength(255)]
    [AllowedValues([Role.Client, Role.Admin])]
    string Role)
{
    public static implicit operator CoreUser(CreateUser newUser)
    {
        return new CoreUser(Guid.NewGuid(), newUser.Name, newUser.Email, newUser.Role);
    }
}

public record UpdateUser(
    [Required] Guid Id,
    [Required] [MaxLength(255)] string Name,
    [Required]
    [MaxLength(255)]
    [EmailAddress]
    string Email,
    [Required]
    [MaxLength(255)]
    [AllowedValues([Role.Client, Role.Admin])]
    string Role)
{
    public static implicit operator CoreUser(UpdateUser updateUser)
    {
        return new CoreUser(updateUser.Id, updateUser.Name, updateUser.Email, updateUser.Role);
    }
}

public record DeleteUser(int NumberOfUsersDeleted);