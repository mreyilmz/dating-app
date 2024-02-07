using System.Security.Claims;
using API.DTOs;
using API.Entities;
using API.Repositories.Abstracts;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UsersController(IUserRepository userRepository, IMapper mapper)
        {
            _mapper = mapper;
            _userRepository = userRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            var users = await _userRepository.GetMembersAsync();
            // var usersToReturn = _mapper.Map<IEnumerable<MemberDto>>(users);
            return Ok(users);
        }

        [HttpGet("{username}")] // /api/users/username
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            return await _userRepository.GetMemberAsync(username);

        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            // When in the context of the API controller we have access to a User object which contains the identity related information that the controller uses to authenticate the user. This is provided by the class we derive from the ControllerBase.
            var username = User.FindFirst(ClaimTypes.NameIdentifier).Value; // Token Service içinde User adında bir token oluşturmuştuk. NameIdentifier olarak da username kullanmıştık.
            var user = await _userRepository.GetUserByUsernameAsync(username);

            if (user == null) return NotFound();

            _mapper.Map(memberUpdateDto, user); // And this line of code is effectively updating all of the properties that we pass through in that "memberUpdateDto" into and overwriting the properties in that user. But nothing's been saved to the database at this point.
            if (await _userRepository.SaveAllAsync()) return NoContent(); // NoContent 204 döndürüyor, yani PUT'un karşılığı.

            return BadRequest("Failed to update user");
        }
    }
}