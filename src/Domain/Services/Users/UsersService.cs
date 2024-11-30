using Domain.DTOs.Users;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Extensions.Users;
using Domain.Interfaces.Playlists;
using Domain.Interfaces.Users;
using Domain.Options;
using Domain.Utils;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace Domain.Services.Users;

public class UsersService : IUsersService
{
    public const string DefaultPlaylistName = "My Titles";
    private readonly JwtSettingsOptions _jwtSettingsOptions;
    private readonly IPlaylistsRepository _playlistsRepository;
    private readonly IUsersRepository _usersRepository;

    public UsersService(IUsersRepository usersRepository, IPlaylistsRepository playlistsRepository,
        IOptions<JwtSettingsOptions> jwtSettingsOptions)
    {
        _usersRepository = usersRepository;
        _playlistsRepository = playlistsRepository;
        _jwtSettingsOptions = jwtSettingsOptions.Value;
    }

    public async Task<List<CoreUser>> GetAllUsersAsync()
    {
        return (await _usersRepository.GetAllUsersAsync()).Select(user => user.ToCoreUser()).ToList();
    }

    public async Task<CoreUser?> GetUserAsync(Guid id)
    {
        return (await _usersRepository.GetUserAsync(id))?.ToCoreUser();
    }

    public async Task<CoreUser> RegisterUser(string email, string password)
    {
        var user = await _usersRepository.GetUserByEmailAsync(email);
        if (user is not null) throw new UserAlreadyExistsException();
        var hashedPassword = PasswordHelper.HashPassword(password);
        var newUser = _usersRepository.CreateUser(email, hashedPassword);
        await _playlistsRepository.CreatePlaylistAsync(newUser.Id, DefaultPlaylistName);
        return newUser.ToCoreUser();
    }

    public async Task<CoreUser> RegisterAdmin(string email, string password)
    {
        var userCount = await _usersRepository.GetUsersCountAsync();
        if (userCount is not 0) throw new AdminAlreadyCreatedException();
        var hashedPassword = PasswordHelper.HashPassword(password);
        var admin = _usersRepository.CreateUser(email, hashedPassword, Role.Admin);
        return admin.ToCoreUser();
    }

    public async Task<(CoreUser, string)> LoginUser(string email, string password)
    {
        var user = await _usersRepository.GetUserByEmailAsync(email);
        if (user is null) throw new UserNotFoundException();
        var result = PasswordHelper.VerifyPassword(user.Password, password);
        switch (result)
        {
            case PasswordVerificationResult.Success:
                return (user.ToCoreUser(), JwtHelper.GenerateJwt(_jwtSettingsOptions, user));
            case PasswordVerificationResult.Failed:
            case PasswordVerificationResult.SuccessRehashNeeded:
            default:
                throw new InvalidCredentialsException();
        }
    }

    public async Task<CoreUser> CreateUserAsync(CoreUser user)
    {
        var userWithSameEmail = await _usersRepository.GetUserByEmailAsync(user.Email);
        if (userWithSameEmail is not null) throw new UserAlreadyExistsException();
        return _usersRepository.CreateUser(user).ToCoreUser();
    }

    public async Task<int> DeleteUserAsync(Guid id)
    {
        return await _usersRepository.DeleteUserAsync(id);
    }

    public async Task<CoreUser> UpdateUserAsync(CoreUser user)
    {
        return (await _usersRepository.UpdateUserAsync(user)).ToCoreUser();
    }
}