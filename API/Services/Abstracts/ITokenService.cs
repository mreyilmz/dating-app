using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.Services.Abstracts;

public interface ITokenService
{
    string CreateToken(AppUser appUser);
}
