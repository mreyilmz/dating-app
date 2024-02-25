

using API.Data;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Repositories.Abstracts;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories.Concretes;

public class UserRepository : IUserRepository
{
    private readonly DataContext _dataContext;
    private readonly IMapper _mapper;

    public UserRepository(DataContext dataContext, IMapper mapper)
    {
        _dataContext = dataContext;
        _mapper = mapper;
    }

    public async Task<MemberDto> GetMemberAsync(string username)
    {
        return await _dataContext.Users
            .Where(x => x.UserName == username)
            .ProjectTo<MemberDto>(_mapper.ConfigurationProvider) // We need to project it into a MemberDto. And Auto Mapper comes with something called queryable extensions, which allows us to project into something. So we're going to use ProjectTo to tell it what we want to project into, which is going to be the MemberDto. And then we can specify the mapper and we just pass in the configuration provider so it knows where to find our mapping profiles, which it gets from the service that we added to our application service extensions.
            .SingleOrDefaultAsync();
    }

    public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
    {
        // Because this is a list of something we're returning, and not a list that we're going to work on inside our UsersController, we can also make Entity Framework a tiny bit more efficient and we can specify "AsNoTracking".
        var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MaxAge - 1));
        var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MinAge));

        var query = _dataContext.Users
            .Where(u => u.UserName != userParams.CurrentUserName)
            .Where(u => u.Gender == userParams.Gender)
            .Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob)
            .OrderByDescending(u =>
                userParams.OrderBy == "created" ? u.Created : u.LastActive
            )
            .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
            .AsNoTracking();

        return await PagedList<MemberDto>.CreateAsync(query, userParams.PageNumber, userParams.PageSize);
        // return await _dataContext.Users
        //     .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
        //     .ToListAsync();
    }

    public async Task<AppUser> GetUserByIdAsync(int id)
    {
        return await _dataContext.Users.FirstOrDefaultAsync(user => user.Id == id);
    }

    public async Task<AppUser> GetUserByUsernameAsync(string username)
    {
        return await _dataContext.Users.Include(u => u.Photos).FirstOrDefaultAsync(user => user.UserName == username.ToLower());
    }

    public async Task<string> GetUserGender(string username)
    {
        return await _dataContext.Users.Where(x => x.UserName == username).Select(x => x.Gender).FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<AppUser>> GetUsersAsync()
    {
        return await _dataContext.Users
            .Include(user => user.Photos)
            .ToListAsync();
    }

    // public async Task<bool> SaveAllAsync()
    // {
    //     return await _dataContext.SaveChangesAsync() > 0;
    // }

    public void Update(AppUser user)
    {
        _dataContext.Entry(user).State = EntityState.Modified;
    }
}
