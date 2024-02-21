using API.Entities;

namespace API.Services.Abstracts;

public interface ITokenService
{
    Task<string> CreateToken(AppUser appUser);
}
