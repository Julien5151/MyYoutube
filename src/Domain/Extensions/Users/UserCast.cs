using Domain.DTOs.Users;
using Domain.Entities;

namespace Domain.Extensions.Users;

public static class UserEntityCastExtensions
{
    public static CoreUser ToCoreUser(this User user)
    {
        return new CoreUser(user.Id, user.Name, user.Email, user.Role);
    }
}