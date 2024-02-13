using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs;

public class RegisterDto
{
    [Required]
    public string Username { get; set; }
    [Required]
    [StringLength(8, MinimumLength = 4)]
    public string Password { get; set; }

    [Required] public string KnownAs { get; set; }
    [Required] public string Gender { get; set; }

    [Required] public DateOnly? DateOfBirth { get; set; } // Note this must be optional or the required validator will not work
    [Required] public string City { get; set; }
    [Required] public string Country { get; set; }

}
