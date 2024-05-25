using Infrastructure.Database;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Application.Attributes;

public class UnitOfWork : ActionFilterAttribute
{
    public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        // Proceed to the next action filter or action method
        var executedContext = await next();
        var myYoutubeContext = executedContext.HttpContext.RequestServices.GetService<MyYoutubeContext>();
        if (myYoutubeContext is not null && myYoutubeContext.ChangeTracker.HasChanges())
            await myYoutubeContext.SaveChangesAsync();
    }
}