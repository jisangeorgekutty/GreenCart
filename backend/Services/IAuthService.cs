using System;
using backend.Entities;
using backend.Models;

namespace backend.Services;

public interface IAuthService
{
    Task<User?> RegisterAsync(UserRegisterDto request);
    Task<TokenResponseDto?> LoginAsync(UserLoginDto request);
    Task<TokenResponseDto?> RefreshTokensAsync(RefreshTokenRequestDto request);

    Task<bool> RevokeRefreshTokenAsync(Guid userId, string refreshToken);
}
