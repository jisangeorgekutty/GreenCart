using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using backend.Data;
using backend.Entities;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;


namespace backend.Services;

public class AuthService(GroceryAppContext context, IConfiguration configuration) : IAuthService
{
    public async Task<TokenResponseDto?> LoginAsync(UserLoginDto request)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user is null)
        {
            return null;
        }

        var passwordVerificationResult = new PasswordHasher<User>()
            .VerifyHashedPassword(user, user.PasswordHash, request.Password);

        if (passwordVerificationResult == PasswordVerificationResult.Failed)
        {
            return null;
        }
        Console.WriteLine($"User Logged In: {user.Name} with Email: {user.Email}");
        return await CreateTokenResponse(user);
    }

    private async Task<TokenResponseDto> CreateTokenResponse(User user)
    {
        return new TokenResponseDto
        {
            AccessToken = CreateToken(user),
            RefreshToken = await GenerateAndSaveRefreshTokenAsync(user)
        };
    }

    public async Task<User?> RegisterAsync(UserRegisterDto request)
    {
        if (await context.Users.AnyAsync(u => u.Email == request.Email))
        {
            return null;
        }
        var user = new User();
        var hashedPassword = new PasswordHasher<User>()
           .HashPassword(user, request.Password);

        user.Name = request.Name;
        user.Email = request.Email;
        user.PasswordHash = hashedPassword;

        context.Users.Add(user);
        await context.SaveChangesAsync();

        return user;
    }

    public async Task<TokenResponseDto?> RefreshTokensAsync(RefreshTokenRequestDto request)
    {
        var user = await ValidateRefreshTokenAsync(request.UserId, request.RefreshToken);
        if (user is null)
        {
            return null;
        }
        return await CreateTokenResponse(user);
    }

    public async Task<bool> RevokeRefreshTokenAsync(Guid userId, string refreshToken)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user is null || user.RefreshToken != refreshToken)
        {
            return false;
        }
        user.RefreshToken = null;
        user.RefreshTokenExpiryTime = null;
        await context.SaveChangesAsync();
        return true;
    }

    private string CreateToken(User user)
    {
        var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier,user.Id.ToString()),
                new Claim(ClaimTypes.Name,user.Name),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(configuration.GetValue<string>("AppSettings:Token")!));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

        var tokenDescriptor = new JwtSecurityToken(
            issuer: configuration.GetValue<string>("AppSettings:Issuer"),
            audience: configuration.GetValue<string>("AppSettings:Audience"),
            claims: claims,
            expires: DateTime.Now.AddDays(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
    }

    private string GenerateRefreshToken()
    {
        var randomNumber = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }

    private async Task<string> GenerateAndSaveRefreshTokenAsync(User user)
    {
        var refreshToken = GenerateRefreshToken();
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await context.SaveChangesAsync();
        return refreshToken;
    }

    private async Task<User?> ValidateRefreshTokenAsync(Guid userId, string refreshToken)
    {
        var user = await context.Users.FindAsync(userId);
        if (user is null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
        {
            return null;
        }
        return user;
    }

}
