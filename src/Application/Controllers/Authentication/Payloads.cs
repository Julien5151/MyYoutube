using System.ComponentModel.DataAnnotations;

namespace Application.Controllers.Authentication;

public record Login(
    [Required] [EmailAddress] string Email,
    [Required]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$",
        ErrorMessage =
            "Password should be at least 8 chars long with one lower case, one upper case, one special char and one number")]
    string Password);

public record LoginSuccess(Guid UserId, string Email, string Role);

public record LoginFailed
{
    public string Message { get; init; } = "Invalid credentials";
    public int StatusCode { get; init; } = StatusCodes.Status400BadRequest;
}

public record Signup(
    [Required] [EmailAddress] string Email,
    [Required]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$",
        ErrorMessage =
            "Password should be at least 8 chars long with one lower case, one upper case, one special char and one number")]
    string Password);

public record AdminAlreadyExists(string Email)
{
    public int StatusCode { get; init; } = StatusCodes.Status409Conflict;
    public string Message { get; init; } = "Admin account has already been created";
}