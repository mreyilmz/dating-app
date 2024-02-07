using API.Entities;

namespace API.Services.Abstracts;

public interface ITokenService
{
    string CreateToken(AppUser appUser);
}
