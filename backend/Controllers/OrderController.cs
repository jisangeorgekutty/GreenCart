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
    public class OrderController(IOrderService orderService) : ControllerBase
    {
        [HttpPost("cod")]
        public async Task<IActionResult> PlaceOrderCOD([FromBody] PlaceOrderRequest request)
        {
            var success = await orderService.PlaceOrderCODAsync(request);
            if (!success)
            {
                return BadRequest(new { message = "Invalid Data" });
            }
            return Ok(new { success = true, message = "Order placed successfully" });
        }

        [HttpGet("user")]
        public async Task<IActionResult> GetUserOrdersAsync([FromQuery] Guid userId)
        {
            var orders = await orderService.GetUserOrdersAsync(userId);
            return Ok(new { success = true, orders });
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllOrdersAsync()
        {
            var orders = await orderService.GetAllOrdersAsync();
            return Ok(new { success = true, orders });
        }

        [HttpPost("myfatoorah")]
        public async Task<ActionResult<MyFatoorahPaymentResponseDto>> PlaceOrderWithMyFatoorah([FromBody] MyFatoorahPaymentRequestDto request)
        {
            if (request.Items == null || !request.Items.Any())
                return new MyFatoorahPaymentResponseDto { Success = false, Message = "Invalid Data" };

            if (request.Address == null)
                return new MyFatoorahPaymentResponseDto { Success = false, Message = "Address is required" };
            var origin = Request.Headers["Origin"].ToString();
            Console.WriteLine($"Origin: {origin}");
            var result = await orderService.PlaceOrderWithMyFatoorahAsync(request, origin);
            return Ok(result);
        }

        [HttpGet("verify-payment")]
        public async Task<IActionResult> VerifyPayment([FromQuery] string paymentId)
        {
            var result = await orderService.VerifyMyFatoorahPaymentAsync(paymentId);
            return Ok(result);
        }

    }
}
