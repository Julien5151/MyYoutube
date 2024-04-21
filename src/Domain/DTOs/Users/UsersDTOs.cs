using Domain.Entities;

namespace Domain.DTOs.Users;

public record CoreUser(Guid Id, string Name, string Email, string Role)
{
    public static implicit operator User(CoreUser coreUser)
    {
        return new User
            { Id = coreUser.Id, Password = "", Name = coreUser.Name, Email = coreUser.Email, Role = coreUser.Role };
    }
}