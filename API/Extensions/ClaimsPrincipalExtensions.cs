using System.Security.Claims;

namespace API.Extensions;

public static class ClaimsPrincipalExtensions
{
    // Bu metodu UsersController içinde UpdateUser'da kullanıyoruz.
    public static string GetUsername(this ClaimsPrincipal user)
    {

        return user.FindFirst(ClaimTypes.Name)?.Value; // Token Service içinde User adında bir token oluşturmuştuk. UniqueName olarak da username kullanmıştık.
    }

    public static int GetUserId(this ClaimsPrincipal user)
    {

        return int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)?.Value); // Token Service içinde User adında bir token oluşturmuştuk. UniqueName olarak da username kullanmıştık.
    }
}
