using System.Security.Claims;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Repositories.Abstracts;
using API.Services.Abstracts;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace API.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;
        private readonly IUnitOfWork _uow;

        public UsersController(IUnitOfWork uow, IMapper mapper, IPhotoService photoService)
        {
            _uow = uow;
            _photoService = photoService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<MemberDto>>> GetUsers([FromQuery] UserParams userParams)
        {
            var gender = await _uow.UserRepository.GetUserGender(User.GetUsername());
            userParams.CurrentUserName = User.GetUsername();

            if (string.IsNullOrEmpty(userParams.Gender))
            {
                userParams.Gender = gender == "male" ? "female" : "male";
            }

            var users = await _uow.UserRepository.GetMembersAsync(userParams);

            Response.AddPaginationHeader(new PaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages));
            // var usersToReturn = _mapper.Map<IEnumerable<MemberDto>>(users);
            return Ok(users);
        }


        [HttpGet("{username}")] // /api/users/username
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            return await _uow.UserRepository.GetMemberAsync(username);

        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            // When in the context of the API controller we have access to a User object which contains the identity related information that the controller uses to authenticate the user. This is provided by the class we derive from the ControllerBase.
            var user = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());

            if (user == null) return NotFound();

            _mapper.Map(memberUpdateDto, user); // And this line of code is effectively updating all of the properties that we pass through in that "memberUpdateDto" into and overwriting the properties in that user. But nothing's been saved to the database at this point.
            if (await _uow.Complete()) return NoContent(); // NoContent 204 döndürüyor, yani PUT'un karşılığı.

            return BadRequest("Failed to update user");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var user = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
            var result = await _photoService.AddPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            if (user.Photos.Count == 0) photo.IsMain = true;

            user.Photos.Add(photo); // Because we're working with the photos collection, we do want to make sure that we're eagerly loading the photos collection with this user when we get it, because we are checking the count of those photos as well. When we used GetUserByUsernameAsync, we included photos with the user, it means that we eagerly loaded the photos.


            if (await _uow.Complete())
            {
                return CreatedAtAction(nameof(GetUser), new { username = user.UserName }, _mapper.Map<PhotoDto>(photo));
            }

            return BadRequest("Problem adding photo");
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var user = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());

            if (user == null) return NotFound();

            var photo = user.Photos.FirstOrDefault(p => p.Id == photoId);

            if (photo == null) return NotFound();
            if (photo.IsMain) return BadRequest("The photo is already your main photo.");

            var currentMain = user.Photos.FirstOrDefault(p => p.IsMain);
            if (currentMain != null) currentMain.IsMain = false;
            photo.IsMain = true;

            if (await _uow.Complete()) return NoContent();

            return BadRequest("Problem setting the main photo");
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await _uow.UserRepository.GetUserByUsernameAsync(User.GetUsername());
            var photo = user.Photos.FirstOrDefault(p => p.Id == photoId);

            if (photo == null) return NotFound();
            if (photo.IsMain) return BadRequest("You cannot delete your main photo.");
            if (photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            user.Photos.Remove(photo);

            if (await _uow.Complete()) return Ok();

            return BadRequest("Problem deleting photo");
        }
    }
}