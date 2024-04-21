using Domain.DTOs.Users;

namespace Domain.Interfaces.Users;

public interface IUsersService
{
    public Task<List<CoreUser>> GetAllUsersAsync();
    public Task<CoreUser?> GetUserAsync(Guid id);
    public Task<CoreUser> RegisterUser(string email, string password);
    public Task<CoreUser> RegisterAdmin(string email, string password);
    public Task<(CoreUser, string)> LoginUser(string email, string password);
    public Task<CoreUser> CreateUserAsync(CoreUser user);
    public Task<int> DeleteUserAsync(Guid id);
    public Task<CoreUser> UpdateUserAsync(CoreUser user);
}