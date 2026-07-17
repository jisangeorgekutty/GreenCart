using System.Security.Claims;
using backend.Entities;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(UserRegisterDto request)
        {
            var user = await authService.RegisterAsync(request);
            if (user is null)
            {
                return BadRequest(new { message = "User Already Exists!!.." });
            }
            Console.WriteLine($"User Registered: {user.Name} with Email: {user.Email}");
            return Ok(user);
        }

        [HttpPost("login")]
        public async Task<ActionResult<TokenResponseDto>> Login(UserLoginDto request)
        {
            var result = await authService.LoginAsync(request);
            if (result is null)
            {
                return BadRequest("Invalid user or password!!!...");
            }
            Console.WriteLine($"User Logged In");
            return Ok(result);
        }
                                 
        [HttpPost("refresh-token")]
        public async Task<ActionResult<TokenResponseDto>> RefreshToken(RefreshTokenRequestDto request)
        {
            var result = await authService.RefreshTokensAsync(request);
            if (result is null || result.AccessToken is null || result.RefreshToken is null)
            {
                return Unauthorized("Invalid refresh token!!..");
            }
            return Ok(result);
        }

        [Authorize]
        [HttpGet("checkAuth")]
        public IActionResult CheckAuth()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var username = User.Identity?.Name;
            return Ok(new
            {
                success = true,
                user = new
                {
                    id = userId,
                    name = username
                }
            });
        }

        // [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] LogoutRequestDto request)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
                return Unauthorized(new { message = "Invalid user ID" });
            Console.WriteLine($"User with ID: {userId} is logging out.");
            var success = await authService.RevokeRefreshTokenAsync(userId, request.RefreshToken);
            if (!success)
            {
                return BadRequest(new { message = "Failed to revoke refresh token" });
            }
            return Ok(new { message = "Logged out successfully" });
        }

        // [HttpGet("checkAuth-debug")]
        // public IActionResult CheckAuthDebug()
        // {
        //     var authHeader = Request.Headers["Authorization"].FirstOrDefault();
        //     return Ok(new { authHeader });
        // }
    }
}

