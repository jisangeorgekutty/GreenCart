using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
     [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AddressController(IAddressService addressService) : ControllerBase
    {
        [HttpPost("add")]
        public async Task<IActionResult> AddAdress(AddressDto addressDto)
        {
            var success = await addressService.AddAddressAsync(addressDto);
            if (success)
            {
                return Ok(new { success = true, message = "Address added successfully" });
            }
            return BadRequest(new { success = false, message = "Failed to add address" });
        }

        [HttpGet("get")]
        public async Task<IActionResult> GetUserAddress([FromQuery] Guid userId)
        {
            var addresses = await addressService.GetUserAddressAsync(userId);
            return Ok(new { success = true, address = addresses });
        }
    }
}
