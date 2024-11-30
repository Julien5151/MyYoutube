using Application.Attributes;
using Application.Controllers.Users;
using Application.Extensions;
using Domain.DTOs.Users;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Application.Controllers.Authentication;

[Route("api/[controller]")]
[ApiController]
public class AuthenticationController : ControllerBase
{
    private readonly IUsersService _usersService;

    public AuthenticationController(IUsersService usersService)
    {
        _usersService = usersService;
    }

    [UnitOfWork]
    [HttpPost("signup")]
    [Authorize(Roles = Role.Admin)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType<UserAlreadyExists>(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Signup(Signup signup)
    {
        try
        {
            await _usersService.RegisterUser(signup.Email, signup.Password);
        }
        catch (UserAlreadyExistsException)
        {
            return Conflict(new UserAlreadyExists(signup.Email));
        }

        return Ok();
    }

    [UnitOfWork]
    [HttpPost("register-admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType<UserAlreadyExists>(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> RegisterAdmin(Signup signup)
    {
        try
        {
            await _usersService.RegisterAdmin(signup.Email, signup.Password);
        }
        catch (AdminAlreadyCreatedException)
        {
            return Conflict(new AdminAlreadyExists(signup.Email));
        }

        return Ok();
    }

    [HttpPost("login")]
    [ProducesResponseType<LoginSuccess>(StatusCodes.Status200OK)]
    [ProducesResponseType<LoginFailed>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<LoginSuccess>> Login(Login login)
    {
        try
        {
            (CoreUser User, string Jwt) result = await _usersService.LoginUser(login.Email, login.Password);
            HttpContext.Response.Cookies.Append(AuthenticationExtensions.JwtCookieName, result.Jwt,
                AuthenticationExtensions.CookiePolicyOptions);
            return new LoginSuccess(result.User.Id, result.User.Email, result.User.Role);
        }
        catch (Exception)
        {
            return BadRequest(new LoginFailed());
        }
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        HttpContext.Response.Cookies.Delete(AuthenticationExtensions.JwtCookieName);
        return Ok();
    }
}