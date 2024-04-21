using System.Security.Claims;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Application.Controllers.Base;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = Role.Client)]
public class ClientControllerBase : ControllerBase
{
    protected Guid GetUserId()
    {
        return Guid.Parse(User.FindFirst(ClaimTypes.PrimarySid)!.Value);
    }
}