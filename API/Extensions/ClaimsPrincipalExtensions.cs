using System.Security.Claims;

namespace API.Extensions;

public static class ClaimsPrincipalExtensions
{
    // Bu metodu UsersController içinde UpdateUser'da kullanıyoruz.
    public static string GetUsername(this ClaimsPrincipal user)
    {

        return user.FindFirst(ClaimTypes.Name)?.Value; // Token Service içinde User adında bir token oluşturmuştuk. UniqueName olarak da username kullanmıştık.
    }

    public static string GetUserId(this ClaimsPrincipal user)
    {

        return user.FindFirst(ClaimTypes.NameIdentifier)?.Value; // Token Service içinde User adında bir token oluşturmuştuk. UniqueName olarak da username kullanmıştık.
    }
}
