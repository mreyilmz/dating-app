using API.Extensions;
using API.Repositories.Abstracts;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Helpers;

public class LogUserActivity : IAsyncActionFilter
{
    // User server'a istek attığında son görülmesini güncelliyoruz.
    // ActionFilters gives us access to the HTTP context so we can do things like get a hold of our user's username and get hold of our "services" as well so that we can update particular property.
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        // resultContext gives us the ActionExecutedContext. That means the API action has completed and we're going to get the result context back from this. 
        // If we wanted to do something before this action, then we could use the ActionExecutingContext context
        var resultContext = await next();

        if (!resultContext.HttpContext.User.Identity.IsAuthenticated) return;

        var userId = resultContext.HttpContext.User.GetUserId();

        var repo = resultContext.HttpContext.RequestServices.GetRequiredService<IUserRepository>();
        var user = await repo.GetUserByIdAsync(int.Parse(userId));
        user.LastActive = DateTime.UtcNow;

        await repo.SaveAllAsync();
    }
}