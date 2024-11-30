using Domain.Entities;

namespace Domain.Interfaces.Users;

public interface IUsersRepository
{
    public Task<List<User>> GetAllUsersAsync();
    public Task<int> GetUsersCountAsync();
    public Task<User?> GetUserAsync(Guid id);
    public Task<User?> GetUserByEmailAsync(string email);
    public User CreateUser(string email, string password, string role = Role.Client);
    public Task<int> DeleteUserAsync(Guid id);
    public Task<User> UpdateUserAsync(User user);
    public User CreateUser(User user);
}