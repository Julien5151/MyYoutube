using Infrastructure.Database;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Application.Attributes;

public class UnitOfWork : ActionFilterAttribute
{
    public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var executedContext = await next();
        var myYoutubeContext = executedContext.HttpContext.RequestServices.GetService<MyYoutubeContext>();
        if (myYoutubeContext is not null && myYoutubeContext.ChangeTracker.HasChanges())
            try
            {
                await myYoutubeContext.SaveChangesAsync();
            }
            catch (Exception)
            {
                executedContext.Result = new BadRequestObjectResult("Something went wrong");
            }
    }
}