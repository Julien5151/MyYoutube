using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces.Users;
using Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories.Users;

public class UsersRepository : IUsersRepository
{
    private readonly MyYoutubeContext _dbContext;

    public UsersRepository(MyYoutubeContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<User>> GetAllUsersAsync()
    {
        return await _dbContext.Users.OrderBy(user => user.Id).Take(100).ToListAsync();
    }

    public async Task<int> GetUsersCountAsync()
    {
        return await _dbContext.Users.CountAsync();
    }

    public async Task<User?> GetUserAsync(Guid id)
    {
        return await _dbContext.Users.FindAsync(id);
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await _dbContext.Users.Where(user => user.Email == email).FirstOrDefaultAsync();
    }

    public async Task<int> DeleteUserAsync(Guid id)
    {
        var user = await _dbContext.Users.FindAsync(id);
        if (user is null) return 0;
        _dbContext.Remove(user);
        await _dbContext.SaveChangesAsync();
        return 1;
    }

    public async Task<User> UpdateUserAsync(User user)
    {
        var userToUpdate = await _dbContext.Users.FindAsync(user.Id);
        if (userToUpdate is null) throw new UserNotFoundException();
        _dbContext.Entry(userToUpdate).CurrentValues.SetValues(user);
        await _dbContext.SaveChangesAsync();
        return userToUpdate;
    }

    public async Task<User> CreateUserAsync(User user)
    {
        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();
        return user;
    }

    public async Task<User> CreateUserAsync(string email, string password, string role)
    {
        User user = new() { Id = new Guid(), Email = email, Password = password, Role = role };
        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();
        return user;
    }
}