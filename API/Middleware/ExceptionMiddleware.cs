

using System.Net;
using System.Text.Json;
using API.Errors;

namespace API.Middleware;
public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;
    private readonly IHostEnvironment _env;
    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
    {
        _env = env;
        _logger = logger;
        _next = next;

    }

    // This method has to be called invoke async because we're relying on the framework to recognize or we're going to tell our framework that this is "middleware".
    // And the middleware, the framework is going to expect to see a method called "InvokeAsync" as that's what it uses to decide what's going to happen next.
    public async Task InvokeAsync(HttpContext context) // HttpContext gives us access to the HTTP request that's currently being passed through the middleware.
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ex.Message);
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            var response = _env.IsDevelopment()
                ? new ApiException(context.Response.StatusCode, ex.Message, ex.StackTrace?.ToString())
                : new ApiException(context.Response.StatusCode, ex.Message, "Internal Server Error");

            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }; // This is something that our API controllers used by default. But again, We're not inside the context of our API controller at this point.

            var json = JsonSerializer.Serialize(response, options);

            await context.Response.WriteAsync(json); // This is going to returns our HTTP response what we've done inside here, when we encounter an exception that's not handled anywhere else in our application.
        }
    }
}
