using backend.Data;
using backend.Models;
using backend.Models.Requests;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CartController(ICartService cartService) : ControllerBase
    {
        [HttpPost("update")]
        public async Task<IActionResult> UpdateCart([FromBody] UpdateCartRequest request)
        {
            if (request == null || request.CartItems == null || !request.CartItems.Any())
            {
                return BadRequest("Invalid cart data");
            }

            await cartService.UpdateCartAsync(request.UserId, request.CartItems);
            return Ok(new { message = "Cart updated successfully" });
        }

        [HttpGet("get")]
        public async Task<IActionResult> GetCart([FromQuery] Guid userId)
        {
            if (userId == Guid.Empty)
                return BadRequest("Invalid user id");
            var cart = await cartService.GetCartAsync(userId);
            if (cart == null)
            {
                return NotFound("Cart not found");
            }
            return Ok(cart);
        }

        [HttpPost("clear")]
        public async Task<IActionResult> ClearCart([FromQuery] Guid userId)
        {
            if (userId == Guid.Empty)
                return BadRequest("Invalid user id");

            var success = await cartService.ClearCartAsync(userId);
            if (!success)
            {
                return BadRequest("Failed to clear cart");
            }
            return Ok(new { message = "Cart cleared successfully" });
        }
    }
}
