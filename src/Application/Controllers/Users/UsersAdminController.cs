using Domain.DTOs.Users;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Application.Controllers.Users;

[Route("api/admin/[controller]")]
[ApiController]
[Authorize(Roles = Role.Admin)]
public class UsersAdminController : ControllerBase
{
    private readonly IUsersService _usersService;

    public UsersAdminController(IUsersService usersService)
    {
        _usersService = usersService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CoreUser>>> GetUsers()
    {
        return await _usersService.GetAllUsersAsync();
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType<CoreUser>(StatusCodes.Status200OK)]
    [ProducesResponseType<UserNotFound>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CoreUser>> GetUser(Guid id)
    {
        var user = await _usersService.GetUserAsync(id);
        return user is not null ? user : NotFound(new UserNotFound(id));
    }

    [HttpPost]
    [ProducesResponseType<CoreUser>(StatusCodes.Status200OK)]
    [ProducesResponseType<UserAlreadyExists>(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<CoreUser>> CreateUser(CreateUser user)
    {
        try
        {
            return await _usersService.CreateUserAsync(user);
        }
        catch (UserAlreadyExistsException)
        {
            return Conflict(new UserAlreadyExists(user.Email));
        }
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType<CoreUser>(StatusCodes.Status200OK)]
    [ProducesResponseType<UserNotFound>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CoreUser>> UpdateUser(Guid id, UpdateUser user)
    {
        if (id != user.Id) return BadRequest();
        try
        {
            return await _usersService.UpdateUserAsync(user);
        }
        catch (UserNotFoundException)
        {
            return NotFound(new UserNotFound(id));
        }
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<DeleteUser>> DeleteUser(Guid id)
    {
        var numberOfUsersDeleted = await _usersService.DeleteUserAsync(id);
        return new DeleteUser(numberOfUsersDeleted);
    }
}