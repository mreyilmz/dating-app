using System.Security.Claims;

namespace API.Extensions;

public static class ClaimsPrincipalExtensions
{
    // Bu metodu UsersController içinde UpdateUser'da kullanıyoruz.
    public static string GetUsername(this ClaimsPrincipal user)
    {

        return user.FindFirst(ClaimTypes.NameIdentifier)?.Value; // Token Service içinde User adında bir token oluşturmuştuk. NameIdentifier olarak da username kullanmıştık.
    }
}
