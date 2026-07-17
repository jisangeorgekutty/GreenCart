using System;

namespace backend.Models;

public class RefreshTokenRequestDto
{
    public Guid UserId { set; get; }
    public required string RefreshToken { get; set; }
}
