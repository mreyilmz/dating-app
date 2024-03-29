using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Repositories.Abstracts;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class MessagesController : BaseApiController
{
    private readonly IUnitOfWork _uow;

    private readonly IMapper _mapper;
    public MessagesController(IMapper mapper, IUnitOfWork uow)
    {
        _uow = uow;
        _mapper = mapper;

    }

    [HttpPost]
    public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
    {
        var username = User.GetUsername();

        if (username == createMessageDto.RecipientUsername.ToLower())
            return BadRequest("You cannot send messages to yourself");

        var sender = await _uow.UserRepository.GetUserByUsernameAsync(username);
        var recipient = await _uow.UserRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername);

        if (recipient == null) return NotFound();


        // Entity Framework knows sender has a sender id and knows the recipient has a recipientID. We still need to specify usernames. Entity Framework won't take care of them for us, but it will do fully ID fields.
        var message = new Message
        {
            Sender = sender,
            SenderId = sender.Id,
            Recipient = recipient,
            RecipientId = recipient.Id,
            SenderUsername = sender.UserName,
            RecipientUsername = recipient.UserName,
            Content = createMessageDto.Content
        };

        _uow.MessageRepository.AddMessage(message);

        if (await _uow.Complete()) return Ok(_mapper.Map<MessageDto>(message));

        return BadRequest("Failed to send message");
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessagesForUser([FromQuery]
        MessageParams messageParams)
    {
        messageParams.Username = User.GetUsername();

        var messages = await _uow.MessageRepository.GetMessagesForUser(messageParams);

        Response.AddPaginationHeader(new PaginationHeader(messages.CurrentPage,
            messages.PageSize, messages.TotalCount, messages.TotalPages));

        return messages;
    }

    // [HttpGet("thread/{username}")]
    // public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessageThread(string username)
    // {
    //     var currentUsername = User.GetUsername();

    //     return Ok(await _uow.MessageRepository.GetMessageThread(currentUsername, username));
    // }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteMessage(int id)
    {
        var username = User.GetUsername();

        var message = await _uow.MessageRepository.GetMessage(id);

        if (message.SenderUsername != username && message.RecipientUsername != username)
            return Unauthorized();

        if (message.SenderUsername == username) message.SenderDeleted = true;

        if (message.RecipientUsername == username) message.RecipientDeleted = true;

        if (message.SenderDeleted && message.RecipientDeleted)
        {
            _uow.MessageRepository.DeleteMessage(message);
        }

        if (await _uow.Complete()) return Ok();

        return BadRequest("Problem deleting the message");
    }


}
