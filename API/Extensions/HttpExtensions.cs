
using System.Text.Json;
using API.Helpers;

// Because we're going to return this inside an HTTP response to make that easier to work with, we'll create a extension method that's going to extend the HTTP response object or class. So it makes it easier for us to use this inside.
namespace API.Extensions;

public static class HttpExtensions
{

    public static void AddPaginationHeader(this HttpResponse response, PaginationHeader header)
    {
        // We're not in the context of a controller, so the default for returning JSON from something like this is not going to be camel case, it would be Pascal case unless we do something like this to tell it otherwise.
        var jsonOptions = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        response.Headers.Append("Pagination", JsonSerializer.Serialize(header, jsonOptions));
        response.Headers.Append("Access-Control-Expose-Headers", "Pagination");
    }
}
